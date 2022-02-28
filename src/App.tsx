/* eslint-disable react/jsx-no-duplicate-props */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
// import _ from "lodash";
// import useAuth from "./hooks/useAuth";
import { Box, Button } from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import useAuth from "./hooks/useAuth";
import { ConnectorNames } from "./types";
import { findWalletAddress } from "./utils/api";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

enum ClaimState {
  Soon,
  Available,
  Claimed
}

enum ErrorType {
  error, warn, success
}

const App: React.FC = () => {
  const { login, account, logout, error } = useAuth();
  const [claimState, setClaimState] = useState(ClaimState.Soon)
  const [timeLimit, setTimeLimit] = useState(3);
  const [open, setOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState({
    error: ErrorType.success,
    content: ''
  });

  useEffect(() => {
    if (claimState === ClaimState.Available) return;
    const timer = setTimeout(() => {
      if (timeLimit - 1 < 0) {
        setClaimState(ClaimState.Available)
        clearTimeout(timer)
        return;
      }
      setTimeLimit(timeLimit => timeLimit - 1)
    }, 1000)
  }, [timeLimit])

  useEffect(() => {
    setErrorMsg(
      error ?
        { content: "Please check your connection Network!", error: ErrorType.error }
        :
        { content: "Connected successfully!", error: ErrorType.success }
    )
  }, [error])

  useEffect(() => {
    (async () => {
      console.log("load from api")
      if (!account) return;
      const res = await findWalletAddress(account)
      if (res.error) {
        setErrorMsg({ content: res.message, error: ErrorType.error })
        setOpen(true)
      }
      else {
        if (claimState === ClaimState.Available) {
          setOpen(true)
          setErrorMsg({ content: res.message, error: res.warn ? ErrorType.warn : ErrorType.success })
          setClaimState(ClaimState.Claimed)
        }
      }
    })()
  }, [account])

  const setNFTText = () => {
    switch (claimState) {
      case ClaimState.Soon:
        return `NFT claim available in ${~~(timeLimit / (24 * 3600))} days ${(~~(timeLimit / 3600) % 24)} hours ${~~((timeLimit / 60) % 60)} min ${timeLimit % 60} sec`
      default:
        return 'NFT Claim available now'
    }

  }
  const setButtonName = useCallback(() => {
    switch (claimState) {
      case ClaimState.Soon:
        return 'claim available soon';
      case ClaimState.Available:
        return 'Claim PATA NFT';
      default:
        return 'You have claimed your PATA NFT!'
    }

  }, [claimState])

  const connectWallet = async () => {
    // if (account) return;
    await login(ConnectorNames.Injected);
  }

  return (
    <>
      <Box width="100%" display="flex" flexDirection="column" p={10} justifyContent="center" alignItems="center" position="relative">
        <Box position="absolute" right="100px" top="50px">
          {account && <Button variant="outlined" onClick={logout}>Disconnect Wallet</Button>}
        </Box>
        <Box px={5} py={1} my={5} border="solid 1px black">LOGO</Box>
        <Box my={5}>{setNFTText()}</Box>
        <Box mt={5} mb={3} color="black"><Button disabled={claimState !== ClaimState.Available} color="inherit" variant="contained" onClick={connectWallet}>{setButtonName()}</Button></Box>
        {account && <Box>Your wallet address is {account}</Box>}
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        onClose={() => { setOpen(false) }}
        // message={errorMsg}
      >
        <Alert severity={errorMsg.error === ErrorType.error ? "error" : (errorMsg.error === ErrorType.warn ? "warning":"success")}>
          <AlertTitle>{errorMsg.error === ErrorType.error ? "Error" : (errorMsg.error === ErrorType.warn ? "Warning":"Success")}</AlertTitle>
          <pre>{errorMsg.content}</pre>
        </Alert>
      </Snackbar>
    </>
  );
};

export default App;
