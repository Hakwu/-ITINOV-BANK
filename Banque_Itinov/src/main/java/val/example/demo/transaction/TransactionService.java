package val.example.demo.transaction;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import val.example.demo.account.Account;
import val.example.demo.account.AccountRepository;
import val.example.demo.api.ApiResponse;
import val.example.demo.api.ResponseBuilder;
import val.example.demo.enums.TransactionType;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static val.example.demo.enums.TransactionType.TRANSFER;
import static val.example.demo.enums.TransactionType.RECEIVE;
import static val.example.demo.enums.TransactionType.WITHDRAW;
import static val.example.demo.enums.TransactionType.DEPOSIT;


@AllArgsConstructor
@Service
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final ResponseBuilder responseBuilder;
    private final AccountRepository accountRepository;

    public ResponseEntity<ApiResponse> getAllTransaction() {
        try {
            return responseBuilder.buildResponse(HttpStatus.OK.value(), "", transactionRepository.findAll());
        } catch (Exception e) {
            return responseBuilder.buildResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage(), "");
        }
    }
    public ResponseEntity<ApiResponse> getTransactionById(String id) {
        try {
            return responseBuilder.buildResponse(HttpStatus.OK.value(), "", transactionRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Transaction not found !")));
        } catch (IllegalArgumentException e) {
            return responseBuilder.buildResponse(HttpStatus.NOT_FOUND.value(), e.getMessage(), "");
        } catch (Exception e) {
            return responseBuilder.buildResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage(), "");
        }
    }

    public ResponseEntity<ApiResponse> getAllTransactionsForAccountsUser(List<Account> accounts) {
        try {
            List<Transaction> allTransactions = new ArrayList<>();
            for (Account account : accounts) {
                List<Transaction> transactions = transactionRepository.findByFromAccountId(account.getAccountId());
                allTransactions.addAll(transactions);
            }
            return responseBuilder.buildResponse(HttpStatus.OK.value(), "", allTransactions);
        } catch (Exception e) {
            return responseBuilder.buildResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage(), "");
        }
    }

    public ResponseEntity<ApiResponse> getTransactionByAccountId(String accountId) {
        try {
            return responseBuilder.buildResponse(HttpStatus.OK.value(), "", transactionRepository.findByFromAccountId(accountId));
        } catch (Exception e) {
            return responseBuilder.buildResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), e.getMessage(), "");
        }
    }

    @Transactional
    public ResponseEntity<ApiResponse> performTransaction(String fromAccountId, TransactionType type, double amount)
    {
        try {
            Account fromAccount = accountRepository.findById(fromAccountId).orElseThrow(() -> new IllegalArgumentException("From Account not found !"));
            if (type.describeConstable().isPresent()) {
                if (type == WITHDRAW)
                    fromAccount.withdraw(amount);
                else if (type == DEPOSIT)
                    fromAccount.deposit(amount);
                accountRepository.save(fromAccount);
            } else {
                throw new IllegalArgumentException("Invalid Transaction Type: " + type);
            }

            LocalDateTime transactionDateTime = LocalDateTime.now();

            Transaction transaction = new Transaction(fromAccountId, "", amount, transactionDateTime, type);
            transactionRepository.save(transaction);
            return responseBuilder.buildResponse(HttpStatus.OK.value(), "Transaction went successfuly.", transaction);
        } catch (IllegalArgumentException e) {
            return responseBuilder.buildResponse(HttpStatus.NOT_FOUND.value(), "Transaction failed: " + e.getMessage(), "");
        } catch (Exception e) {
            return responseBuilder.buildResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Transaction failed due to unexpected error:" + e.getMessage(), "");
        }
    }
    @Transactional
    public ResponseEntity<ApiResponse> performTransactionToAccount(String fromAccountId, String toAccountId, double amount)
    {
        try {
            if (fromAccountId.equals(toAccountId))
                return responseBuilder.buildResponse(HttpStatus.NOT_ACCEPTABLE.value(), "Transaction failed: You cannot send money to the same account !", "");

            Account fromAccount = accountRepository.findById(fromAccountId).orElseThrow(() -> new IllegalArgumentException("From Account not found !"));
            Account toAccount = accountRepository.findById(toAccountId).orElseThrow(() -> new IllegalArgumentException("To Account not found !"));

            fromAccount.withdraw(amount);
            toAccount.deposit(amount);

            accountRepository.save(fromAccount);
            accountRepository.save(toAccount);
            LocalDateTime transactionDateTime = LocalDateTime.now();

//            Transaction transactionfromAccount = new Transaction(fromAccountId, toAccountId, amount, transactionDateTime, TRANSFER, fromAccount.getBalance(), toAccount.getBalance());
//            Transaction transactiontoAccount = new Transaction(fromAccountId, toAccountId, amount, transactionDateTime, TRANSFER, fromAccount.getBalance(), toAccount.getBalance());
            Transaction transactionfromAccount = new Transaction(fromAccountId, toAccountId, amount, transactionDateTime, TRANSFER);
            Transaction transactiontoAccount = new Transaction(toAccountId, fromAccountId, amount, transactionDateTime, RECEIVE);


            transactionRepository.save(transactionfromAccount);
            transactionRepository.save(transactiontoAccount);

            return responseBuilder.buildResponse(HttpStatus.OK.value(), "Transaction went successfuly.", transactionfromAccount);
        } catch (IllegalArgumentException e) {
            return responseBuilder.buildResponse(HttpStatus.NOT_FOUND.value(), "Transaction failed: " + e.getMessage(), "");
        } catch (Exception e) {
            return responseBuilder.buildResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Transaction failed due to unexpected error:" + e.getMessage(), "");
        }
    }
}
