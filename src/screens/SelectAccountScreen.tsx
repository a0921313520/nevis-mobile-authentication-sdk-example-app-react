/**
 * Copyright © 2023 Nevis Security AG. All rights reserved.
 */

import React, { useCallback } from 'react';
import { FlatList, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { useDynamicValue } from 'react-native-dynamic';

import { type RootStackParamList } from './RootStackParamList';
import useSelectAccountViewModel from './SelectAccountViewModel';
import { dynamicStyles } from '../Styles';

import OutlinedButton from '../components/OutlinedButton';

type Props = NativeStackScreenProps<RootStackParamList, 'SelectAccount'>;

type SelectAccountItemData = {
	username: string;
};

type SelectAccountItemProps = {
	item: SelectAccountItemData;
	onPress: () => void;
};

const SelectAccountListItem = ({ title, onPress }: { title: string; onPress: () => void }) => {
	const styles = useDynamicValue(dynamicStyles);
	return (
		<TouchableOpacity style={styles.listContainer} onPress={onPress}>
			<Text style={styles.textNormal}>{title}</Text>
		</TouchableOpacity>
	);
};

const SelectAccountItem = ({ item, onPress }: SelectAccountItemProps) => (
	<SelectAccountListItem title={item.username} onPress={onPress} />
);

const SelectAccountScreen = ({ route }: Props) => {
	const { select } = useSelectAccountViewModel();

	const { t } = useTranslation();
	const styles = useDynamicValue(dynamicStyles);

	function getItems() {
		return route.params.items.map((item) => {
			return {
				username: item.username,
			};
		});
	}

	const renderSeparator = () => <View style={styles.horizontalHairline} />;

	const renderItem = ({ item }: { item: SelectAccountItemData }) => {
		return (
			<SelectAccountItem
				item={item}
				onPress={() =>
					select(
						item.username,
						route.params.operation,
						route.params.transactionConfirmationData,
						route.params.handler
					)
				}
			/>
		);
	};
	const { cancel } = useSelectAccountViewModel();

	const onCancel = useCallback(async () => {
        cancel();
    }, []);

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.titleContainer}>
				<Text style={styles.textTitle}>{t('selectAccount.title')}</Text>
				<FlatList
					data={getItems()}
					ItemSeparatorComponent={renderSeparator}
					renderItem={renderItem}
					keyExtractor={(item) => item.username}
				/>
				<OutlinedButton text={t('cancelButtonTitle')} onPress={onCancel} />
			</View>
		</SafeAreaView>
	);
};

export default SelectAccountScreen;
