import React, {useEffect, useState} from "react";
import axios from "axios";
import { Link } from "react-router-dom";


interface User {
    userId: string;
    firstName: string;
    lastName: string;
}

interface AccountProps {
    data: User;
}
interface Account {
    accountId: string;
    userId: string;
    accountType: string;
    balance: number;
    currency: string;
}

function Account({data}: AccountProps)
{
    const [account, setAccount] = useState<Account[]>([]);

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
    return (
        <section className="account-section">
            <h1 className="account-title">MES COMPTES</h1>
            <div className="account-group">
            {account.map((item, index) => (
                <Link key={index} to={"/history/" + item.accountId}>
                    <div className="account-card">
                        <div className="account-info">
                            <div className="account-name">Compte {item.accountType}</div>
                            <div className="account-id">M {data.firstName} {data.lastName} N°{item.accountId}</div>
                        </div>
                        <div className="balance">{item.balance} {item.currency}</div>
                    </div>
                </Link>
            ))}
            </div>
        </section>
    )
}

export default Account;
