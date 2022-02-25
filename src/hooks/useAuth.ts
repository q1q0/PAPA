import { useWeb3React } from "@web3-react/core";
import { ConnectorNames } from "../types";
import { connectorsByName } from "../utils/web3React";

const useAuth = () => {
  const { activate, account, library, connector, active, deactivate, error } = useWeb3React();

  const login = async (conectorID: ConnectorNames) => {
    const connector = connectorsByName[conectorID];
    if (connector) {
      try {
        await activate(connector, (error: Error) => {
          alert(error.name + " ----- " + error.message)
          return error.name
        });
      } catch (e) { console.log("connect error=========", e); return false; }

    } else {
      alert("The connector config is wriong");
    }
  };

  return { login, logout: deactivate, account, library, connector, active, error };
};

export default useAuth;
