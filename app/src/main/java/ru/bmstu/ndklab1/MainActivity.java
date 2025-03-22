package ru.bmstu.ndklab1;

import org.apache.commons.codec.DecoderException;
import org.apache.commons.codec.binary.Hex;


import androidx.activity.result.ActivityResult;
import androidx.activity.result.ActivityResultCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import ru.bmstu.ndklab1.databinding.ActivityMainBinding;

public class MainActivity extends AppCompatActivity implements TransactionEvents  {

    static {
        System.loadLibrary("ndklab1");
        System.loadLibrary("mbedcrypto");
    }

    private String pin;

    @Override
    public String enterPin(int ptc, String amount) {
        pin = new String();
        Intent it = new Intent(MainActivity.this, PinpadActivity.class);
        it.putExtra("ptc", ptc);
        it.putExtra("amount", amount);
        synchronized (MainActivity.this) {
            activityResultLauncher.launch(it);
            try {
                MainActivity.this.wait();
            } catch (Exception ex) {
                //todo: log error
            }
        }
        return pin;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {



        int result = initRng();
        if (result == 0) {
            Log.d("MainActivity", "RNG initialized successfully");
        } else {
            Log.e("MainActivity", "RNG initialization failed");
        }
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        activityResultLauncher  = registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                new ActivityResultCallback<ActivityResult>() {
                    @Override
                    public void onActivityResult(ActivityResult result) {
                        if (result.getResultCode() == Activity.RESULT_OK) {
                            Intent data = result.getData();
                            // обработка результата
                            //String pin = data.getStringExtra("pin");
                            //Toast.makeText(MainActivity.this, pin, Toast.LENGTH_SHORT).show();
                            pin = data.getStringExtra("pin");
                            synchronized (MainActivity.this) {
                                MainActivity.this.notifyAll();
                            }
                        }
                    }
                });
    }



    ActivityResultLauncher activityResultLauncher;



    private ActivityMainBinding binding;

    public native String stringFromJNI();

    public static byte[] stringToHex(String s)
    {
        byte[] hex;
        try
        {
            hex = Hex.decodeHex(s.toCharArray());
        }
        catch (DecoderException ex)
        {
            hex = null;
        }
        return hex;
    }


    // Шифрование по нажатию кнопки
    /* public void onButtonClick(View v)
    {
        byte[] key = stringToHex("0123456789ABCDEF0123456789ABCDE0");
        byte[] enc = encrypt(key, stringToHex("DEADBEEF0000000102"));
        byte[] dec = decrypt(key, enc);
        String s = new String(Hex.encodeHex(dec)).toUpperCase();
        Toast.makeText(this, s, Toast.LENGTH_SHORT).show();
    } */

    public static void printBytes(byte[] bytes) {
        for (byte b : bytes) {
            System.out.printf("%02X ", b); // Вывод каждого байта в виде HEX-значения
        }
        System.out.println(); // Переход на новую строку после вывода
    }

    public void onButtonClick(View v)
    {

        byte[] trd = stringToHex("9F0206000000000100");
        transaction(trd);

    }


    @Override
    public void transactionResult(boolean result) {
        runOnUiThread(()-> {
            Toast.makeText(MainActivity.this, result ? "ok" : "failed", Toast.LENGTH_SHORT).show();
        });
    }





    public static native byte[] encrypt(byte[] key, byte[] data);
    public static native byte[] decrypt(byte[] key, byte[] data);
    public static native int initRng();
    public static native byte[] randomBytes(int no);


    public native boolean transaction(byte[] trd);




}