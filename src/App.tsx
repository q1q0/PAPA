/* eslint-disable react/jsx-no-duplicate-props */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
// import _ from "lodash";
// import useAuth from "./hooks/useAuth";
import { Box, Button } from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import useAuth from "./hooks/useAuth";
import { ConnectorNames } from "./types";
import { findWalletAddressOrCreate } from "./utils/api";

enum ClaimState {
  Soon,
  Available,
  Claimed
}

const App: React.FC = () => {
  const { login, account, logout, error } = useAuth();
  const [claimState, setClaimState] = useState(ClaimState.Soon)
  const [timeLimit, setTimeLimit] = useState(10);
  const [open, setOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string>();

  useEffect(() => {
    if(claimState === ClaimState.Available) return;
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
    setErrorMsg(error?"Please check your connection Network!" : "Connection Successful!")
  }, [error])

  useMemo(()=>{
    (async()=>{
      if(!account) return;
      const res = await findWalletAddressOrCreate(account)
      console.log("===========", res);
      if(res.error) {
        setErrorMsg(res.error)
        setOpen(true)
      }
      else {
        if(claimState === ClaimState.Available) {
          setOpen(true)
          setErrorMsg(res.data.message)
          setClaimState(ClaimState.Claimed)
        }
      }
    })()
  }, [account, claimState])

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

  const connectWallet = async() => {
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
        {account&&<Box>Your wallet address is {account}</Box>}
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        onClose={()=>{setOpen(false)}}
        message={errorMsg}
      />
    </>
  );
};

export default App;
