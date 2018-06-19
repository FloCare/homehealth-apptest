import RNSecureKeyStore from 'react-native-secure-key-store';

export function getUserProps() {
    return RNSecureKeyStore.get('accessToken').catch(error => {
        console.log('error in getting access token');
        throw error;
    })
        .then(token => fetch('https://app-9707.on-aptible.com/users/v1.0/profile/?format=json',
            {
                method: 'GET',
                headers: {
                    Authorization: `Token ${token}`,
                },
            }))
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('HTTP request not OK');
        });

    // return new Promise((resolve) => {
    //     setTimeout(resolve, 300, {
    //         id: 999,
    //         roles: [
    //             {
    //                 role: 'PT',
    //                 org: 'ORG'
    //             }
    //         ]
    //     });
    // });
}
