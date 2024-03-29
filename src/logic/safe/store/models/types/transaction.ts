import { List, Map, RecordOf } from 'immutable'

import { Confirmation } from './confirmation'
import { GnosisSafe } from 'src/types/contracts/GnosisSafe.d'
import { DataDecoded, DecodedParams, Transfer } from './transactions.d'
import { Operation } from 'src/types/gateway/transactions'

export enum TransactionTypes {
  OUTGOING = 'outgoing',
  SETTINGS = 'settings',
  CUSTOM = 'custom',
  CREATION = 'creation',
  CANCELLATION = 'cancellation',
  UPGRADE = 'upgrade',
  TOKEN = 'token',
  COLLECTIBLE = 'collectible',
  MODULE = 'module',
  SPENDING_LIMIT = 'spendingLimit',
}
export type TransactionTypeValues = typeof TransactionTypes[keyof typeof TransactionTypes]

export enum TransactionStatus {
  AWAITING_YOUR_CONFIRMATION = 'awaiting_your_confirmation',
  AWAITING_CONFIRMATIONS = 'awaiting_confirmations',
  SUCCESS = 'success',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  AWAITING_EXECUTION = 'awaiting_execution',
  PENDING = 'pending',
}
export type TransactionStatusValues = typeof TransactionStatus[keyof typeof TransactionStatus]

export enum PendingActionType {
  CONFIRM = 'confirm',
  REJECT = 'reject',
}
export type PendingActionValues = PendingActionType[keyof PendingActionType]
export type RefundParams = { fee: string; symbol: string }

export type TransactionProps = {
  baseGas: number
  blockNumber?: number | null
  cancelled?: boolean
  confirmations: List<Confirmation>
  created: string
  creator: string
  creationTx: boolean
  customTx: boolean
  data: string | null
  dataDecoded: DataDecoded | null
  decimals?: (number | string) | null
  decodedParams: DecodedParams
  executionDate?: string | null
  executionTxHash?: string | null
  executor: string
  factoryAddress: string
  fee: string | null // It will be replace with the new TXs types.
  gasPrice: string
  gasToken: string
  isCancellationTx: boolean
  isCollectibleTransfer: boolean
  isExecuted: boolean
  isPending?: boolean
  isSuccessful?: boolean
  isTokenTransfer: boolean
  masterCopy: string
  modifySettingsTx: boolean
  multiSendTx: boolean
  nonce: number
  operation: number
  origin: string | null
  ownersWithPendingActions: Map<PendingActionValues, List<any>>
  recipient: string
  refundParams: RefundParams | null
  refundReceiver: string
  safeTxGas: number
  safeTxHash: string
  setupData: string
  status: TransactionStatus
  submissionDate: string | null
  symbol?: string | null
  transactionHash: string | null
  transfers?: Transfer[]
  type: TransactionTypes
  upgradeTx: boolean
  value: string
}

export type Transaction = RecordOf<TransactionProps> & Readonly<TransactionProps>

export type TxArgs = {
  baseGas: number
  data: string
  gasPrice: string
  gasToken: string
  nonce: number
  operation: Operation
  refundReceiver: string
  safeInstance: GnosisSafe
  safeTxGas: number
  sender?: string
  sigs: string
  to: string
  valueInWei: string
}
