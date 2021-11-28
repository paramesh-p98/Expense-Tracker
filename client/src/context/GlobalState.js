import React, { createContext, useReducer } from "react";
import AppReducer from './AppReducer';

//Initial State
const initialState = {
    transactions: [],
    error: null,
    loading: true
}

//create context 

export const GlobalContext = createContext(initialState);

//Provider component

export const GlobalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AppReducer, initialState);

    //Actions
    async function getTransactions() {
        fetch('/api/v1/transactions')
            .then(response => response.json())
            .then(res => {
                dispatch({
                    type: 'GET_TRANSACTION',
                    payload: res.data
                })
            })
            .catch((error) => {
                dispatch({
                    type: 'TRANSACTION_ERROR',
                    payload: error
                })
            });
    }

    async function deleteTransaction(id) {
        fetch(`/api/v1/transactions/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(res => {
                dispatch({
                    type: 'DELETE_TRANSACTION',
                    payload: id
                })
            })
            .catch((error) => {
                dispatch({
                    type: 'TRANSACTION_ERROR',
                    payload: error
                })
            });
    }

    async function addTransaction(transactions) {
        fetch('/api/v1/transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: transactions.text,
                amount: transactions.amount
            })
        })
            .then(response => response.json())
            .then(res => {
                if (res.data) {
                    dispatch({
                        type: 'ADD_TRANSACTION',
                        payload: transactions
                    });
                } else {
                    dispatch({
                        type: 'TRANSACTION_ERROR',
                        payload: "Enter the Amount"
                    })
                }
            })
            .catch((error) => {
                dispatch({
                    type: 'TRANSACTION_ERROR',
                    payload: error
                })
            });
    }


    return (
        <GlobalContext.Provider value={{
            transactions: state.transactions,
            error: state.error,
            loading: state.loading,
            getTransactions,
            deleteTransaction,
            addTransaction
        }}>
            {children}
        </GlobalContext.Provider>
    )
}