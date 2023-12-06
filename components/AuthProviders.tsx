"use client"
// vì dùng typescript, nên sẽ phải tạo data type.
// mục đích của file này là tạo component AuthProviders
// component này có mục đích chính là hiển thị các nút đăng nhập từ các providers khác nhau như Google,...(Đăng nhập với...)
// do đó, nó cần lấy được list các providers rồi map ra thành list các button tương ứng.

import { getProviders, signIn } from 'next-auth/react';
import React, { useEffect, useState } from 'react'

import Button from './Button';

// tạo type cho provider, gồm các thông tin như id, name,...(ví dụ google, github,... thì sẽ gồm id, name,... như thế nào)
type Provider = {
    id: string;
    name: string;
    type: string;
    signinUrl: string;
    callbackUrl: string;
    signinUrlParams?: Record<string, string> | undefined;
  };
  
  // tạo type Providers có tác dụng tạo một object map provider id với provider object.
  type Providers = Record<string, Provider>;

//tạo component AuthProviders
const AuthProviders = () => {
    const [providers, setProviders] = useState<Providers | null>(null);

    //dùng useEffect để lấy list providers. effect này sẽ only run once after the first render vì second argument của nó là empty array.
    // list providers này sẽ được gán vào providers state nhờ setProviders.
    useEffect(() => {
        const fetchProviders = async () => {
            const res = await getProviders();
    
            setProviders(res);
        }

        fetchProviders();
    }, []);
// nếu tồn tại providers (not empty array) thì sẽ map ra thành các button.
    if (providers) {
        return (
            <div>
                {/* dùng Object.values method để lấy một array provider objects từ providers object. Sau đó với array các provider thu được thì map nó ra. Mỗi button sẽ có hàm signIn tương ứng. */}
                {Object.values(providers).map((provider: Provider, i) => (
                    <Button key={i} title='Sign In' handleClick={() => signIn(provider?.id)} />
                ))}
            </div>
        )
    }
}

export default AuthProviders