import React, { useEffect, useMemo, useState } from "react";
import ReactSelect, { ControlProps } from "react-select";
import {
	AvailableTokens,
	AvailableTokenType,
	PresaleState,
	SwapAmountType,
} from "./type";
import {
	Button,
	CustomControl,
	Flex,
	SelectItem,
	SwapAmountInputWrapper,
	TokenAmountAutoInputer,
	TokenAmountAutoInputItem,
	TokenImage,
	TokenSwapAmountInputer,
	TokenSwapAmountItem,
	TokenSwapAmountPanel,
} from "./styled";
import { useAppSelector } from "../../app/hooks";
import { BasicProps } from "../../constants/BasicTypes";
import { IDOInterface } from "../../constants/IDOs";
import useIDOStatus from "./useIDOStatus";
import { getTokenName, TokenStatus, TokenType } from "../../types/tokens";
import Text from "../../components/Text";
import { SwapCrossIcon } from "../../components/SvgIcons";
import useContract from "../../hook/useContract";
import { toast } from "react-toastify";

interface SwapAmountInputProps extends BasicProps {
	idoInfo: IDOInterface;
	isMobile?: boolean;
	buyCallback?: any;
}

const SwapAmountInput: React.FC<SwapAmountInputProps> = ({
	idoInfo,
	buyCallback,
	isMobile,
}) => {
	const [swapAmount, setSwapAmount] = useState<any>({
		[SwapAmountType.ORIGIN]: 0,
		[SwapAmountType.TARGET]: 0,
	});
	const [selectedTokenType, setSelectedTokenType] =
		useState<AvailableTokenType>(TokenType.JUNO);

	const SelectOptions = (
		Object.keys(AvailableTokens) as Array<keyof typeof AvailableTokens>
	).map((key) => {
		return {
			value: key,
		};
	});
	const { idoStatus: basicIdoStatus } = useIDOStatus(idoInfo.id);
	const { runExecute } = useContract();

	const balances = useAppSelector((state) => state.balances);
	const idoStatus = useMemo(() => {
		const tokenBalance =
			(balances[selectedTokenType]?.amount || 0) /
			Math.pow(10, TokenStatus[selectedTokenType as TokenType].decimal || 6);

		let ratio = basicIdoStatus.costs[selectedTokenType];

		return {
			...basicIdoStatus,
			ratio,
			tokenBalance,
			balance: `${tokenBalance.toLocaleString("en-Us", {
				maximumFractionDigits: 2,
			})} ${AvailableTokens[selectedTokenType].symbol}`,
		};
	}, [balances, basicIdoStatus, selectedTokenType]);

	useEffect(() => {
		handleChangeSwapAmount(
			SwapAmountType.ORIGIN,
			swapAmount[SwapAmountType.ORIGIN]
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [idoStatus.ratio]);

	const handleChangeSwapAmountInput = (amountType: SwapAmountType, e: any) => {
		const { value } = e.target;
		if (!Number.isNaN(Number(value))) {
			handleChangeSwapAmount(amountType, value);
		}
	};

	const handleChangeSwapAmount = (amountType: SwapAmountType, amount: any) => {
		let newAmountObject = {
			[amountType]: amount,
		};
		if (amountType === SwapAmountType.ORIGIN) {
			newAmountObject[SwapAmountType.TARGET] = Number(amount) * idoStatus.ratio;
		} else {
			newAmountObject[SwapAmountType.ORIGIN] = Number(amount) / idoStatus.ratio;
		}
		setSwapAmount(newAmountObject);
	};

	const handleBuyToken = async () => {
		if (swapAmount[SwapAmountType.ORIGIN] === 0) {
			toast.error("Invalid amount!");
			return;
		}
		if (idoStatus.crrState === PresaleState.BEFORE) {
			toast.error("Presale is not started");
			return;
		}
		if (idoStatus.crrState === PresaleState.ENDED) {
			toast.error("Presale is ended");
			return;
		}
		try {
			await runExecute(
				idoInfo.contract,
				{
					buy_token: {},
				},
				{
					funds: `${swapAmount[SwapAmountType.ORIGIN]}`,
					denom: selectedTokenType,
				}
			);
			toast.success("Successfully Buy!");
			if (buyCallback) buyCallback();
		} catch (e) {
			toast.error("Buying Failed!");
			console.error(e);
		}
	};

	const CustomSelectItem = ({ ...props }) => {
		const { selectOption, option, container } = props;
		return (
			<SelectItem
				onClick={() => {
					if (selectOption) selectOption(option);
				}}
				checked={option.value === selectedTokenType}
			>
				<TokenImage
					alt=""
					src={`/coin-images/${option.value.replace(/\//g, "")}.png`}
				/>
				{!isMobile && (
					<Text
						color={container ? undefined : "black"}
						fontSize={isMobile ? "12px" : "18px"}
					>
						{getTokenName(option.value)}
					</Text>
				)}
			</SelectItem>
		);
	};

	const CustomMenuList = (props: any) => {
		const { options, selectOption } = props;
		return options.map((option: any, index: number) => (
			<CustomSelectItem
				key={index}
				selectOption={selectOption}
				option={option}
			/>
		));
	};

	const CustomControlItem = ({
		children,
		...props
	}: ControlProps<any, false>) => {
		const {
			innerProps: { onMouseDown, onTouchEnd },
		} = props;
		return (
			<CustomControl onMouseDown={onMouseDown} onTouchEnd={onTouchEnd}>
				<CustomSelectItem option={{ value: selectedTokenType }} container />
				{children}
			</CustomControl>
		);
	};

	return (
		<SwapAmountInputWrapper>
			<TokenSwapAmountPanel>
				<TokenSwapAmountItem>
					<ReactSelect
						value={{ value: selectedTokenType }}
						onChange={(value: any) => setSelectedTokenType(value.value)}
						options={SelectOptions}
						styles={{
							container: (provided, state) => ({
								...provided,
								// margin: "5px 10px",
								border: "1px solid black",
								borderRadius: "5px",
							}),
							dropdownIndicator: (provided, state) => ({
								...provided,
								padding: 0,
								color: "black",
							}),
							menu: (provided, state) => ({
								...provided,
								// backgroundColor: isDark ? "#838383" : "white",
								zIndex: 10,
							}),
						}}
						components={{
							MenuList: CustomMenuList,
							Control: CustomControlItem,
							ValueContainer: () => null,
							IndicatorSeparator: () => null,
						}}
					/>
					<TokenSwapAmountInputer>
						<TokenAmountAutoInputer>
							<TokenAmountAutoInputItem
								onClick={() =>
									handleChangeSwapAmount(
										SwapAmountType.ORIGIN,
										idoStatus.tokenBalance * 0.25
									)
								}
							>
								25%
							</TokenAmountAutoInputItem>
							<TokenAmountAutoInputItem
								onClick={() =>
									handleChangeSwapAmount(
										SwapAmountType.ORIGIN,
										idoStatus.tokenBalance * 0.5
									)
								}
							>
								50%
							</TokenAmountAutoInputItem>
							<TokenAmountAutoInputItem
								onClick={() =>
									handleChangeSwapAmount(
										SwapAmountType.ORIGIN,
										idoStatus.tokenBalance * 0.75
									)
								}
							>
								75%
							</TokenAmountAutoInputItem>
							<TokenAmountAutoInputItem
								onClick={() =>
									handleChangeSwapAmount(
										SwapAmountType.ORIGIN,
										idoStatus.tokenBalance
									)
								}
							>
								100%
							</TokenAmountAutoInputItem>
						</TokenAmountAutoInputer>
						<input
							value={swapAmount[SwapAmountType.ORIGIN]}
							onChange={(e) =>
								handleChangeSwapAmountInput(SwapAmountType.ORIGIN, e)
							}
						/>
						{isMobile ? (
							<TokenAmountAutoInputItem alignItems="center">
								{`Balance ${idoStatus.tokenBalance.toLocaleString("en-Us", {
									maximumFractionDigits: 2,
								})}`}
								<TokenImage
									src={`/coin-images/${selectedTokenType.replace(
										/\//g,
										""
									)}.png`}
									alt=""
								/>
							</TokenAmountAutoInputItem>
						) : (
							<TokenAmountAutoInputItem>{`Balance ${idoStatus.balance}`}</TokenAmountAutoInputItem>
						)}
					</TokenSwapAmountInputer>
				</TokenSwapAmountItem>
				<SwapCrossIcon width={isMobile ? 20 : 30} />
				<Flex flexDirection="column" alignItems="center" gap="5px">
					{isMobile ? (
						<Text fontSize={isMobile ? "12px" : "18px"} alignItems="center">
							1
							<TokenImage
								src={`/coin-images/${selectedTokenType.replace(/\//g, "")}.png`}
								alt=""
							/>
							{` = ${idoStatus.ratio}`}
							<TokenImage src={`/token-logos/${idoInfo.id}.png`} alt="" />
						</Text>
					) : (
						<Text
							fontSize={isMobile ? "12px" : "18px"}
						>{`1 ${AvailableTokens[selectedTokenType].symbol} = ${idoStatus.ratio} ${idoInfo.symbol}`}</Text>
					)}
					<TokenSwapAmountItem style={{ alignItems: "flex-start" }}>
						<TokenSwapAmountInputer>
							<input
								value={swapAmount[SwapAmountType.TARGET]}
								onChange={(e) =>
									handleChangeSwapAmountInput(SwapAmountType.TARGET, e)
								}
							/>
							<Text fontSize={isMobile ? "12px" : "18px"}>
								{idoInfo.symbol}
							</Text>
						</TokenSwapAmountInputer>
						<TokenImage
							style={{ marginTop: 10 }}
							src={`/token-logos/${idoInfo.id}.png`}
							alt=""
						/>
					</TokenSwapAmountItem>
				</Flex>
			</TokenSwapAmountPanel>
			<Button onClick={handleBuyToken}>BUY</Button>
		</SwapAmountInputWrapper>
	);
};

export default SwapAmountInput;
