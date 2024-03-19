import React, {useEffect, useState} from "react";
import axios from "axios";
import CustomSelect from "../Component/CustomSelect";
import Loader from "../Component/Loader";

interface User {
    userId: string;
    firstName: string;
    lastName: string;
}

interface TransactionProps {
    data: User;
}
interface Account {
    accountId: string;
    userId: string;
    accountType: string;
    balance: number;
    currency: string;
}

function Transaction({data} : TransactionProps) {
    const [account, setAccount] = useState<Account[]>([]);
    const [fromAccount, setFromAccount] = useState<Account | undefined>(undefined);
    const [toAccount, setToAccount] = useState<Account | undefined>(undefined);
    const [amount, setAmount] = useState('...');
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("");


    useEffect(() => {
        fetchData();
    },[data.userId])
    async function fetchData() {
        try {
            await axios.get(`http://localhost:8080/api/v1/account/user/${data.userId}`).then(response => {
                const userAccount = response.data.data.map((account: { accountType: string; currency: string; balance:number;}) => ({
                    ...account,
                    balance: transformBalance(account.balance),
                    currency: transformCurrency(account.currency),
                    accountType: transformType(account.accountType)
                }));
                setAccount(userAccount);
            })
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        function transformBalance(balance:number) {
            return balance.toFixed(2);
        }
        function transformCurrency(currency: string) {
            return currency === 'EURO' ? "€" : currency;
        }
        function transformType(type: string) {
            return type === 'CHECKING' ? 'de dépôt' : 'épargne';
        }
    }

    async function submitTransaction() {
        if (fromAccount && toAccount && amount !== "...") {
            try {
                await axios.post(`http://localhost:8080/api/v1/transaction`,
                    {fromAccountId: fromAccount.accountId, toAccountId: toAccount.accountId, amount: amount}).then((response) => {
                        if (response.status === 200) {
                            setStatus("success")
                            setMessage("La transaction a bien été effectuée.");
                        }
                })
            } catch (e) {
                setMessage("Une erreur s'est produite, veuillez réessayer.");
                setStatus("")
                console.error('Error sending data:', e);
            }
        }
    }

    function setReset() {
        window.location.reload();
    }
    return (
        <section>
            <div className="transaction-section">
                <h1 className="transaction-title">TRANSACTION</h1>
                <p className="ask-transaction-info">Depuis quel compte ?</p>
                <CustomSelect account={account} selectedAccount={setFromAccount} value={fromAccount}/>
                {fromAccount &&
                    <div>
                        <div className="part2">
                            <div style={{width: "100%"}}>
                                <p className="ask-2nd-part">Vers quel compte ?</p>
                                <CustomSelect account={account} selectedAccount={setToAccount} value={fromAccount}/>
                            </div>
                            <div style={{width: "100%"}}>
                                <p className="ask-2nd-part">Montant</p>
                                <div style={{paddingTop: 20, paddingBottom: 30}}>
                                    <div className="contain-amount">
                                        <input className="amount"
                                               type="number"
                                               min="0"
                                               value={amount}
                                               onChange={(e) => setAmount(e.target.value)}></input>
                                        <div style={{fontSize: 32}}>€</div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="submit-section">
                            <div className="confirmation-section">
                                <p>Envoyer <span>{amount}{fromAccount.currency}</span> depuis le
                                    compte <span>{fromAccount.accountType}</span> vers le
                                    compte <span>{toAccount?.accountType}</span>.</p>
                            </div>
                            <div className="submit-button" onClick={submitTransaction}>
                                <button>Valider</button>
                            </div>
                        </div>
                    </div>
                }
            </div>
            <div className={`modal-contain ${message === "" ? "" : "show"}`}>
                <div className="status-modal">
                    <span className="material-symbols-outlined close-modal" onClick={setReset}>close</span>
                    <Loader status={status}></Loader>
                    <h1>{message}</h1>
                    <div className="modal-button">
                        <button onClick={setReset}>D'accord</button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Transaction;
