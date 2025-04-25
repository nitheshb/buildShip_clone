export const cryptoService = {
    async encrypt(text: string): Promise<string> {
      if (!text) return '';
      
      try {
        const secret = process.env.NEXT_PUBLIC_ENCRYPTION_SECRET || '';
        const salt = process.env.NEXT_PUBLIC_ENCRYPTION_SALT || '';
        
        const keyMaterial = await this.getKeyMaterial(secret);
        const iv = crypto.getRandomValues(new Uint8Array(12));        
        const key = await crypto.subtle.deriveKey(
          {
            name: 'PBKDF2',
            salt: new TextEncoder().encode(salt),
            iterations: 100000,
            hash: 'SHA-256'
          },
          keyMaterial,
          { name: 'AES-GCM', length: 256 },
          false,
          ['encrypt']
        );        
        const encodedText = new TextEncoder().encode(text);
        const encryptedBuffer = await crypto.subtle.encrypt(
          { name: 'AES-GCM', iv },
          key,
          encodedText
        );        
        const encryptedArray = new Uint8Array(iv.length + encryptedBuffer.byteLength);
        encryptedArray.set(iv);
        encryptedArray.set(new Uint8Array(encryptedBuffer), iv.length);
        
        return btoa(String.fromCharCode(...encryptedArray));
      } catch (error) {
        console.error('Encryption error:', error);
        return '';
      }
    },

    async decrypt(encryptedBase64: string): Promise<string> {
      if (!encryptedBase64) return '';
      
      try {
        const secret = process.env.NEXT_PUBLIC_ENCRYPTION_SECRET || '';
        const salt = process.env.NEXT_PUBLIC_ENCRYPTION_SALT || '';
        
        const encryptedData = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
        
        const iv = encryptedData.slice(0, 12);
        const ciphertext = encryptedData.slice(12);
        
        const keyMaterial = await this.getKeyMaterial(secret);
        const key = await crypto.subtle.deriveKey(
          {
            name: 'PBKDF2',
            salt: new TextEncoder().encode(salt),
            iterations: 100000,
            hash: 'SHA-256'
          },
          keyMaterial,
          { name: 'AES-GCM', length: 256 },
          false,
          ['decrypt']
        );
        
        const decryptedBuffer = await crypto.subtle.decrypt(
          { name: 'AES-GCM', iv },
          key,
          ciphertext
        );
        
        return new TextDecoder().decode(decryptedBuffer);
      } catch (error) {
        console.error('Decryption error:', error);
        return '';
      }
    },

    async getKeyMaterial(password: string) {
      const encoder = new TextEncoder();
      return crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
      );
    }
  };