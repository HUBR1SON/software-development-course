package ru.bmstu.rpo.REST.tools;

import org.springframework.security.crypto.codec.Hex;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class Utils {

    public static String ComputeHash(String pwd, String salt) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            // Правильное объединение пароля и соли
            String combined = pwd + salt;
            byte[] hashBytes = digest.digest(combined.getBytes());
            return new String(Hex.encode(hashBytes));
        } catch (NoSuchAlgorithmException ex) {
            throw new RuntimeException("SHA-256 algorithm not found", ex);
        }
    }
}