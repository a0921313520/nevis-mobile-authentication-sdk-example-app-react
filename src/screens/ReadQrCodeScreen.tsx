/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import React, { useCallback, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { useTranslation } from 'react-i18next';
import { useDynamicValue } from 'react-native-dynamic';
import {
	Camera,
	useCameraDevice,
	useCameraPermission,
	useCodeScanner,
} from 'react-native-vision-camera';

import useReadQrCodeViewModel from './ReadQrCodeViewModel';
import CloseButton from '../components/CloseButton';
import { dynamicStyles } from '../Styles';

const ReadQrCodeScreen = () => {
	const { setDispatchTokenResponse, close } = useReadQrCodeViewModel();

	const { t } = useTranslation();
	const styles = useDynamicValue(dynamicStyles);

	const [errorMessage, setErrorMessage] = useState('');

	const { hasPermission, requestPermission } = useCameraPermission();
	const device = useCameraDevice('back');

	const codeScanner = useCodeScanner({
		codeTypes: ['qr'],
		onCodeScanned: (codes) => {
			const value = codes[0]?.value;
			if (value) {
				setDispatchTokenResponse(value);
			}
		},
	});

	const onClose = useCallback(async () => {
		close();
	}, []);

	if (!device && !errorMessage) {
		setErrorMessage('No Camera Found');
	}

	if (!hasPermission && !errorMessage) {
		requestPermission().then((permissionGiven) => {
			if (!permissionGiven) {
				setErrorMessage('Camera Permission Needed to read QR Code');
			}
		});
	}

	return (
		<SafeAreaView style={styles.container}>
			<CloseButton onPress={onClose} />
			<Text style={styles.textTitle}>{t('readQrCode.title')}</Text>
			<View style={styles.middleContainer}>
				{device && hasPermission && (
					<Camera
						style={StyleSheet.absoluteFill}
						device={device}
						codeScanner={codeScanner}
						isActive={true}
					/>
				)}
				{errorMessage && (
					<Text style={[styles.textNormal, styles.textCenter]}>{errorMessage}</Text>
				)}
			</View>
		</SafeAreaView>
	);
};

export default ReadQrCodeScreen;
