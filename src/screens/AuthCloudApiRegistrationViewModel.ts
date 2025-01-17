/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import { useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from './RootStackParamList';
import { ErrorHandler } from '../error/ErrorHandler';
import { OperationType } from '../model/OperationType';
import { BiometricUserVerifierImpl } from '../userInteraction/BiometricUserVerifierImpl';
import { DevicePasscodeUserVerifierImpl } from '../userInteraction/DevicePasscodeUserVerifierImpl';
import { FingerprintUserVerifierImpl } from '../userInteraction/FingerprintUserVerifierImpl';
import { PinEnrollerImpl } from '../userInteraction/PinEnrollerImpl';
import { RegistrationAuthenticatorSelectorImpl } from '../userInteraction/RegistrationAuthenticatorSelectorImpl';
import { ClientProvider } from '../utility/ClientProvider';
import { DeviceInformationUtils } from '../utility/DeviceInformationUtils';

import { CallApi } from './UsernamePasswordLoginScreen1'

const useAuthCloudApiRegistrationViewModel = () => {
	const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

	const [enrollResponse, setEnrollResponse] = useState('');
	const [appLinkUri, setAppLinkUri] = useState('');

	async function confirm() {
		const client = ClientProvider.getInstance().client;
		const authCloudApiRegistration = client?.operations.authCloudApiRegistration
			.deviceInformation(DeviceInformationUtils.create())
			.authenticatorSelector(new RegistrationAuthenticatorSelectorImpl())
			.pinEnroller(new PinEnrollerImpl())
			.biometricUserVerifier(new BiometricUserVerifierImpl())
			.devicePasscodeUserVerifier(new DevicePasscodeUserVerifierImpl())
			.fingerprintUserVerifier(new FingerprintUserVerifierImpl())
			.onSuccess(() => {
				CallApi()
				console.log('Auth Cloud API registration succeeded.');
				navigation.navigate('Result', {
					operation: OperationType.authCloudApiRegistration,
				});
			})
			.onError(ErrorHandler.handle.bind(null, OperationType.authCloudApiRegistration));

		if (enrollResponse) {
			authCloudApiRegistration?.enrollResponse(enrollResponse);
		}

		if (appLinkUri) {
			authCloudApiRegistration?.appLinkUri(appLinkUri);
		}

		await authCloudApiRegistration
			?.execute()
			.catch(ErrorHandler.handle.bind(null, OperationType.authCloudApiRegistration));
	}

	function cancel() {
		navigation.goBack();
	}

	return {
		setEnrollResponse,
		setAppLinkUri,
		confirm,
		cancel,
	};
};

export default useAuthCloudApiRegistrationViewModel;
