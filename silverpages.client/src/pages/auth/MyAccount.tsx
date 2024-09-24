import { useEffect, useState } from 'react';

export interface AccountInfo {
  email: string;
}

export function MyAccount() {
  const [AccountInfo, setAccountInfo] = useState<AccountInfo>();

  useEffect(() => {
    populateAccountInfo();
  }, []);

  const contents = AccountInfo === undefined
    ? <p> Loading.... </p>
    : <div>
      <p>{AccountInfo.email}</p>
    </div>

  return (
    <div>
      <h1>My Account Info</h1>
      {contents}
    </div>
  );

  async function populateAccountInfo() {
    const response = await fetch(`/api/manage/info`);
    const data = await response.json();
    setAccountInfo(data);
  }
}