package com.cengkihtrack.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileRequest {

    @Size(max = 100, message = "Nama maksimal 100 karakter")
    private String name;

    @Email(message = "Format email tidak valid")
    @Size(max = 150, message = "Email maksimal 150 karakter")
    private String email;

    @Size(max = 20, message = "Nomor telepon maksimal 20 karakter")
    private String phone;

    private String address;

    /** Opsional — hanya diisi jika ingin mengganti password */
    @Size(min = 8, max = 100, message = "Password minimal 8 karakter")
    private String newPassword;

    /** Wajib jika newPassword diisi */
    private String currentPassword;
}
