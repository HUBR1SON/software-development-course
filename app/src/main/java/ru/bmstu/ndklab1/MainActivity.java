package ru.bmstu.ndklab1;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.widget.TextView;

import ru.bmstu.ndklab1.databinding.ActivityMainBinding;

public class MainActivity extends AppCompatActivity {

    // Used to load the 'ndklab1' library on application startup.
    static {
        System.loadLibrary("ndklab1");
        System.loadLibrary("mbedcrypto");
    }

    private ActivityMainBinding binding;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        // Example of a call to a native method
        TextView tv = binding.sampleText;
        tv.setText(stringFromJNI());
        byte[] key = {55, 16, 100, 87, 19, 90, 45, 3, 7, 123, 14, 5, 2, 127, 6, 14};
        byte[] data = {45, 120, 16};
        byte[] res = encrypt(key, data);
        res = decrypt(key, res);
        return;
    }

    /**
     * A native method that is implemented by the 'ndklab1' native library,
     * which is packaged with this application.
     */
    public native String stringFromJNI();
    public static native byte[] encrypt(byte[] key, byte[] data);
    public static native byte[] decrypt(byte[] key, byte[] data);
}