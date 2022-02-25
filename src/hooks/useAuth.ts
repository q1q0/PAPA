import { useWeb3React } from "@web3-react/core";
import { useState } from "react";
import { ConnectorNames } from "../types";
import { connectorsByName } from "../utils/web3React";

const useAuth = () => {
  const { activate, account, library, connector, active, deactivate } = useWeb3React();

  const [error, setError] = useState<string>()

  const login = async (conectorID: ConnectorNames) => {
    const connector = connectorsByName[conectorID];
    if (connector) {
      try {
        await activate(connector, (error: Error) => {
          alert(error.name + " ----- " + error.message)
          setError(error.name)
        });
      } catch (e) { console.log("connect error=========", e); return false; }

    } else {
      alert("The connector config is wriong");
    }
  };

  return { login, logout: deactivate, account, library, connector, active, error };
};

export default useAuth;
