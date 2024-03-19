package val.example.demo.transaction;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import val.example.demo.account.Account;
import val.example.demo.account.AccountService;
import val.example.demo.api.ApiResponse;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000") // Allow requests from this origin
@RequestMapping("api/v1/transaction")
@AllArgsConstructor
public class TransactionController {
    private final TransactionService transactionService;
    private final AccountService accountService;

    @PostMapping
    public ResponseEntity<ApiResponse> fetchTransactionToAccount(@RequestBody Transaction request) {
        return transactionService.performTransactionToAccount(request.getFromAccountId(), request.getToAccountId(), request.getAmount());
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse> fetchAllTransaction() {
        return transactionService.getAllTransaction();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> fetchTransactionById(@PathVariable String id) {
        return transactionService.getTransactionById(id);
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<ApiResponse> fetchTransactionByAccountId(@PathVariable String accountId) {
        return transactionService.getTransactionByAccountId(accountId);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse> fetchTransactionByUserId(@PathVariable String userId) {
        List<Account> accounts = accountService.getAccountByUserId(userId);
        return transactionService.getAllTransactionsForAccountsUser(accounts);
    }

    @PostMapping("/operation")
    public ResponseEntity<ApiResponse> fetchTransactionOperation(@RequestBody Transaction request) {
        return transactionService.performTransaction(request.getFromAccountId(), request.getType(), request.getAmount());
    }
}
