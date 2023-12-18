/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import React, { useCallback, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, View, Clipboard } from 'react-native';

import { useTranslation } from 'react-i18next';
import { useDynamicValue } from 'react-native-dynamic';

import useUsernamePasswordLoginViewModel from './UsernamePasswordLoginViewModel';
import InputField from '../components/InputField';
import OutlinedButton from '../components/OutlinedButton';
import { dynamicStyles } from '../Styles';

const UsernamePasswordLoginScreen1 = () => {
    const { cancel } = useUsernamePasswordLoginViewModel();

    const [username, setUsername] = useState('');

    const { t } = useTranslation();
    const styles = useDynamicValue(dynamicStyles);

    const onCancel = useCallback(async () => {
        cancel();
    }, []);

    const onConfirm = () => {

        fetch('https://weatherapi20231127165848.azurewebsites.net/Register', { method: 'POST', headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: username }) })
            .then((response) => headerData = response.json()).then((responseData) => {
                let datas = responseData?.statusToken || ''
                if (datas) {
                    window.statusToken = datas
                    Alert.alert(
                        "Register",
                        JSON.stringify(responseData),
                        [
                            {
                                text: "copy appLinkUri", onPress: () => {
                                    try {
                                        Clipboard.setString(responseData.appLinkUri);
                                    } catch (error) {
                            
                                    }
                                }
                            }
                        ]
                    );
                } else {
                    Alert.alert(
                        "Register",
                        JSON.stringify(responseData),
                        [
                            {
                                text: "OK", onPress: () => {}
                            }
                        ]
                    )
                }

            }).catch((error) => {
                Alert.alert(
                    "Register",
                    JSON.stringify(error),
                    [
                        {
                            text: "OK", onPress: () => {}
                        }
                    ]
                )
            })
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.textTitle}>{t('usernamePasswordLogin.title')}</Text>
                </View>
                <View style={styles.middleContainer}>
                    <Text style={styles.textNormal}>{t('usernamePasswordLogin.username')}</Text>
                    <InputField
                        placeholder={t('usernamePasswordLogin.username')}
                        onChangeText={setUsername}
                    />
                </View>
                <View style={styles.bottomContainer}>
                    <OutlinedButton text={t('confirmButtonTitle')} onPress={onConfirm} />
                    <OutlinedButton text={t('cancelButtonTitle')} onPress={onCancel} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default UsernamePasswordLoginScreen1;

export const CallApi = () => {
    let formData = new FormData();
    formData.append('token', window.statusToken);

    fetch('https://weatherapi20231127165848.azurewebsites.net/VerifyToken', { method: 'POST',  body: formData })
        .then((response) => headerData = response.json()).then((res) => {
            Alert.alert(
                "VerifyToken",
                JSON.stringify(res),
                [
                    {
                        text: "OK", onPress: () => {}
                    }
                ]
            )
        }).catch((error) => {
            Alert.alert(
                "VerifyToken",
                JSON.stringify(error),
                [
                    {
                        text: "OK", onPress: () => {}
                    }
                ]
            )
        })
}
