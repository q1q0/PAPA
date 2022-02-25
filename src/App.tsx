/* eslint-disable react/jsx-no-duplicate-props */
import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
// import _ from "lodash";
// import useAuth from "./hooks/useAuth";
import { Box, Button } from "@mui/material";
import useAuth from "./hooks/useAuth";
import { ConnectorNames } from "./types";

enum ClaimState {
  Soon,
  Available,
  Claimed
}

const App: React.FC = () => {
  const { login, account, logout } = useAuth();
  const [claimState, setClaimState] = useState(ClaimState.Soon)
  const [timeLimit, setTimeLimit] = useState(10);

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
    if(account && claimState === ClaimState.Available)
      setClaimState(ClaimState.Claimed)
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

  // const onClickBtn = () => {
  //   switch (claimState) {
  //     case ClaimState.Soon:
  //       return 'claim available soon';
  //     case ClaimState.Available:
  //       return 'Claim PATA NFT';
  //     default:
  //       return 'You have claimed your PATA NFT!'
  //   }
  // }

  const connectWallet = async() => {
    if (account) return;
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
    </>
  );
};

export default App;
