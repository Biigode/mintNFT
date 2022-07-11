import axios from "axios";

export const retriveNFTByWallet = async (): Promise<any> => {
  try {
    const requestParams = {
      method: "GET",
      url: "https://api.nftport.xyz/v0/accounts/0xf448B04Dc6675c4450e1cb74548e42b477777384",
      params: {
        chain: "rinkeby",
        account_address: "0xf448B04Dc6675c4450e1cb74548e42b477777384",
        page_size: "23",
        include: "metadata",
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: "28d01458-a7e6-4bae-a447-0248282ff7cc",
      },
    };

    const response = await axios.request(requestParams);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const retriveNFTByContract = async (): Promise<any> => {
  try {
    const requestParams = {
      method: "GET",
      url: "https://api.nftport.xyz/v0/nfts/0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
      params: { chain: "ethereum", page_size: "10", include: "metadata" },
      headers: {
        "Content-Type": "application/json",
        Authorization: "28d01458-a7e6-4bae-a447-0248282ff7cc",
      },
    };

    const response = await axios.request(requestParams);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
