import os
import base64
from pathlib import Path

from dotenv import load_dotenv
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

ROOT_ENV_PATH = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(ROOT_ENV_PATH, override=False)

ENCRYPT_KEY = os.getenv("ENCRYPT_KEY", "")

def _encode_data(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode("ascii")

def _decode_data(data: str) -> bytes:
    try:
        return base64.b64decode(
            data.encode("ascii"),
            altchars=b"-_",
            validate=True
        )
    except Exception as exc:
        raise ValueError(
            "Invalid Base64 encoding."
        ) from exc

def _retrieve_master_key() -> AESGCM:

    if not ENCRYPT_KEY:
        raise RuntimeError(
            "ENCRYPT_KEY environment variable is missing."
        )

    master_key = _decode_data(ENCRYPT_KEY)

    if len(master_key) != 32:
        raise ValueError(
            "Master key must be 256 bits (32 bytes)."
        )

    return AESGCM(master_key)

def _retrieve_user_key(key: str) -> bytes:

    master_aes = _retrieve_master_key()

    encrypted_data = _decode_data(key)

    # 12-byte nonce + 16-byte authentication tag.
    if len(encrypted_data) < 28:
        raise ValueError("Invalid encrypted user key.")

    nonce = encrypted_data[:12]
    ciphertext = encrypted_data[12:]

    try:
        plaintext = master_aes.decrypt(
            nonce,
            ciphertext,
            None
        )
    except Exception as exc:
        raise ValueError(
            "Unable to decrypt user key."
        ) from exc

    # Recover the original Base64-encoded user key.
    user_key_bytes = _decode_data(
        plaintext.decode("ascii")
    )

    if len(user_key_bytes) != 32:
        raise ValueError(
            "User AES key must be 256 bits (32 bytes)."
        )

    return AESGCM(user_key_bytes)


def encryption(key: str, body: str) -> str:

    aes = _retrieve_user_key(key)

    # Generate a unique 12-byte nonce.
    nonce = os.urandom(12)

    ciphertext = aes.encrypt(
        nonce,
        body.encode("utf-8"),
        None
    )

    # Store nonce + ciphertext + authentication tag.
    encrypted_data = nonce + ciphertext

    return _encode_data(encrypted_data)

def decryption(key: str, body: str) -> str:

    aes = _retrieve_user_key(key)

    encrypted_data = _decode_data(body)

    if len(encrypted_data) < 28:
        raise ValueError("Invalid encrypted data.")

    nonce = encrypted_data[:12]
    ciphertext = encrypted_data[12:]

    try:
        plaintext = aes.decrypt(
            nonce,
            ciphertext,
            None
        )
    except Exception as exc:
        raise ValueError(
            "Decryption failed: invalid key or corrupted data."
        ) from exc

    return plaintext.decode("utf-8")



def generateUserKey() -> str:

    # Generate a random 256-bit AES key.
    user_key_bytes = AESGCM.generate_key(
        bit_length=256
    )

    # Encode the user key into Base64.
    user_key = _encode_data(user_key_bytes)

    # Retrieve the master AES key.
    master_aes = _retrieve_master_key()

    # Generate a unique nonce.
    nonce = os.urandom(12)

    # Encrypt the user AES key using the master key.
    ciphertext = master_aes.encrypt(
        nonce,
        user_key.encode("ascii"),
        None
    )

    # Store nonce + ciphertext + authentication tag.
    encrypted_data = nonce + ciphertext

    return _encode_data(encrypted_data)

