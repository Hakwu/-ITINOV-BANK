import React, {useEffect, useState} from "react";

interface Account {
    accountId: string;
    userId: string;
    accountType: string;
    balance: number;
    currency: string;
}

interface CustomSelectProps {
    account: Account[];
    selectedAccount: (account: Account) => Account | void;
    value: Account | void;
}

function CustomSelect({account, selectedAccount, value} : CustomSelectProps)
{
    const defaultValue = "Sélectionnez un compte.";
    const [indexAccount, setIndexAccount] = useState(-1);
    const [isOpen, setIsOpen] = useState(false);
    const [filterAccount, setFilterAccount] = useState<Account[]>()
    useEffect(() => {
        if (value) {
            setFilterAccount(account.filter(elem => value !== elem))
        }

    }, [account, value]);
    const handleSelectClick = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (optionValue: string) => {
        const index = account.findIndex((account:Account) => account.accountId === optionValue);
        setIndexAccount(index);
        selectedAccount(account[index]);
        setIsOpen(false);
    };

    return (
        <div className="custom-select">
            <div className="select" onClick={handleSelectClick}>
                <div style={{display: 'flex', justifyContent: 'space-between', width: "100%"}}>
                    {indexAccount !== -1 ? (
                        <>
                            <div>
                                <div className="account-name">Compte {account[indexAccount].accountType}</div>
                                <div className="account-id">N°{account[indexAccount].accountId}</div>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center'}}
                                 className="balance">{account[indexAccount].balance} {account[indexAccount].currency}</div>
                        </>
                    ) : (defaultValue)}
                </div>
                <span className={`material-symbols-outlined ${isOpen ? 'show' : ''}`}>expand_more</span>
            </div>
            <div className={`custom-select-menu ${isOpen ? 'show' : ''}`}>
                {filterAccount ?
                    (filterAccount.map((item, index) => (
                    <div
                        key={index}
                        className="custom-select-option"
                        onClick={() => handleOptionClick(item.accountId)}>
                        <div>
                            <div className="account-name">Compte {item.accountType}</div>
                            <div className="account-id">N°{item.accountId}</div>
                        </div>
                        <div className="balance">{item.balance} {item.currency}</div>
                    </div>
                ))) : (account.map((item, index) => (
                        <div
                            key={index}
                            className="custom-select-option"
                            onClick={() => handleOptionClick(item.accountId)}>
                            <div>
                                <div className="account-name">Compte {item.accountType}</div>
                                <div className="account-id">N°{item.accountId}</div>
                            </div>
                            <div className="balance">{item.balance} {item.currency}</div>
                        </div>
                    )))}
            </div>
        </div>
    )
}

export default CustomSelect
