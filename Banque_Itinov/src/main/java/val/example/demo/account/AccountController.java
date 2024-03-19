package val.example.demo.account;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import val.example.demo.api.ApiResponse;
import val.example.demo.transaction.TransactionService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api/v1/account")
@AllArgsConstructor
public class AccountController {
    private final AccountService accountService;
    @GetMapping
    public ResponseEntity<ApiResponse> fetchAllAccount() {
        return accountService.getAllAccount();
    }
    @GetMapping("/{accountId}")
    public ResponseEntity<ApiResponse> fetchAccountById(@PathVariable String accountId) {
        return accountService.getAccountByAccountId(accountId);
    }
    @GetMapping("/user/{userid}")
    public ResponseEntity<ApiResponse> fetchAccountByOwnerId(@PathVariable String userid) {
        return accountService.getAccountByOwnerId(userid);
    }
}
