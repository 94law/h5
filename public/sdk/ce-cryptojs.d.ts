import forge from 'node-forge';
export declare type Algorithm = 'AES-GCM' | 'AES-CBC';
export interface AESEncrypted {
    ciphertext: string;
    nonce: string;
}
export interface AESDecrypted {
    passed: boolean;
    plaintext: string;
}
export interface RSAEncrypted {
    key: string;
    ciphertext: string;
    nonce: string;
    algorithm?: Algorithm;
}
export interface RSAEncryptedResult {
    aesKey: string;
    data: RSAEncrypted;
}
declare const AES: {
    /**
     * AES加密
     * @param key AES密钥
     * @param ciphertext 密文
     * @param algorithm 算法，默认 AES-GCM
     * @returns
     */
    encrypt(key: string, ciphertext: string, algorithm?: Algorithm): AESEncrypted;
    /**
     * AES解密
     * @param key AES密钥
     * @param nonce 初始向量
     * @param ciphertext 密文
     * @param algorithm 算法，默认 AES-GCM
     * @returns
     */
    decrypt(key: string, nonce: string, ciphertext: string, algorithm?: Algorithm): string;
};
declare const RSAWithAES: {
    /**
     * RSA及AES加密
     * @param publicKey RSA公钥
     * @param plaintext 明文
     * @param algorithm AES算法
     * @returns
     */
    encrypt(publicKey: string, plaintext: string, algorithm?: Algorithm): RSAEncryptedResult;
};
export interface CECryptojsStatic {
    AES: typeof AES;
    RSAWithAES: typeof RSAWithAES;
    util: typeof forge.util;
    random: typeof forge.random;
    version: string;
}
declare const CECryptojs: CECryptojsStatic;
export default CECryptojs;
