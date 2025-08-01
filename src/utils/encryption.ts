// Client-side encryption utilities
const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;

class EncryptionManager {
  private static instance: EncryptionManager;
  private key: CryptoKey | null = null;

  private constructor() {}

  static getInstance(): EncryptionManager {
    if (!EncryptionManager.instance) {
      EncryptionManager.instance = new EncryptionManager();
    }
    return EncryptionManager.instance;
  }

  private async getKey(): Promise<CryptoKey> {
    if (this.key) {
      return this.key;
    }

    // In a real app, you'd derive this from the user's master password
    // For demo purposes, we'll use a static key
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode('demo-master-key-32-characters!'),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );

    this.key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: new TextEncoder().encode('securepass-salt'),
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: ALGORITHM, length: KEY_LENGTH },
      false,
      ['encrypt', 'decrypt']
    );

    return this.key;
  }

  async encrypt(plaintext: string): Promise<string> {
    const key = await this.getKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const data = new TextEncoder().encode(plaintext);

    const ciphertext = await crypto.subtle.encrypt(
      { name: ALGORITHM, iv },
      key,
      data
    );

    // Combine IV and ciphertext
    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(ciphertext), iv.length);

    return btoa(String.fromCharCode(...combined));
  }

  async decrypt(ciphertext: string): Promise<string> {
    const key = await this.getKey();
    const combined = new Uint8Array(
      atob(ciphertext)
        .split('')
        .map(char => char.charCodeAt(0))
    );

    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    const plaintext = await crypto.subtle.decrypt(
      { name: ALGORITHM, iv },
      key,
      data
    );

    return new TextDecoder().decode(plaintext);
  }
}

const encryptionManager = EncryptionManager.getInstance();

export const encrypt = (plaintext: string): Promise<string> => {
  return encryptionManager.encrypt(plaintext);
};

export const decrypt = (ciphertext: string): Promise<string> => {
  return encryptionManager.decrypt(ciphertext);
};

// Password hashing utilities
export const hashPassword = async (password: string): Promise<{ hashedPassword: string; salt: string }> => {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const encoder = new TextEncoder();
  const data = encoder.encode(password);

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    data,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const hashedBuffer = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );

  const hashedPassword = btoa(String.fromCharCode(...new Uint8Array(hashedBuffer)));
  const saltString = btoa(String.fromCharCode(...salt));

  return { hashedPassword, salt: saltString };
};

export const verifyPassword = async (password: string, hashedPassword: string, salt: string): Promise<boolean> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const saltBytes = new Uint8Array(atob(salt).split('').map(char => char.charCodeAt(0)));

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    data,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const hashedBuffer = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );

  const newHashedPassword = btoa(String.fromCharCode(...new Uint8Array(hashedBuffer)));
  return newHashedPassword === hashedPassword;
};