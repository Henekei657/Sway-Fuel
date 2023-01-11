/* Autogenerated file. Do not edit manually. */

/* tslint:disable */
/* eslint-disable */

/*
  Fuels version: 0.28.1
  Forc version: 0.32.2
  Fuel-Core version: 0.15.1
*/

import { Interface, Contract } from "fuels";
import type { Provider, BaseWalletLocked, AbstractAddress } from "fuels";
import type { AMMContractAbi, AMMContractAbiInterface } from "../AMMContractAbi";

const _abi = {
  "types": [
    {
      "typeId": 0,
      "type": "()",
      "components": [],
      "typeParameters": null
    },
    {
      "typeId": 1,
      "type": "(_, _)",
      "components": [
        {
          "name": "__tuple_element",
          "type": 6,
          "typeArguments": null
        },
        {
          "name": "__tuple_element",
          "type": 6,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 2,
      "type": "b256",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 3,
      "type": "enum InitError",
      "components": [
        {
          "name": "BytecodeRootAlreadySet",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "BytecodeRootDoesNotMatch",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "BytecodeRootNotSet",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "PairDoesNotDefinePool",
          "type": 0,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 4,
      "type": "enum Option",
      "components": [
        {
          "name": "None",
          "type": 0,
          "typeArguments": null
        },
        {
          "name": "Some",
          "type": 5,
          "typeArguments": null
        }
      ],
      "typeParameters": [
        5
      ]
    },
    {
      "typeId": 5,
      "type": "generic T",
      "components": null,
      "typeParameters": null
    },
    {
      "typeId": 6,
      "type": "struct ContractId",
      "components": [
        {
          "name": "value",
          "type": 2,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 7,
      "type": "struct RegisterPoolEvent",
      "components": [
        {
          "name": "asset_pair",
          "type": 1,
          "typeArguments": null
        },
        {
          "name": "pool",
          "type": 6,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    },
    {
      "typeId": 8,
      "type": "struct SetExchangeBytecodeRootEvent",
      "components": [
        {
          "name": "root",
          "type": 2,
          "typeArguments": null
        }
      ],
      "typeParameters": null
    }
  ],
  "functions": [
    {
      "inputs": [
        {
          "name": "asset_pair",
          "type": 1,
          "typeArguments": null
        },
        {
          "name": "pool",
          "type": 6,
          "typeArguments": null
        }
      ],
      "name": "add_pool",
      "output": {
        "name": "",
        "type": 0,
        "typeArguments": null
      }
    },
    {
      "inputs": [
        {
          "name": "exchange_bytecode_root",
          "type": 6,
          "typeArguments": null
        }
      ],
      "name": "initialize",
      "output": {
        "name": "",
        "type": 0,
        "typeArguments": null
      }
    },
    {
      "inputs": [
        {
          "name": "asset_pair",
          "type": 1,
          "typeArguments": null
        }
      ],
      "name": "pool",
      "output": {
        "name": "",
        "type": 4,
        "typeArguments": [
          {
            "name": "",
            "type": 6,
            "typeArguments": null
          }
        ]
      }
    }
  ],
  "loggedTypes": [
    {
      "logId": 0,
      "loggedType": {
        "name": "",
        "type": 3,
        "typeArguments": []
      }
    },
    {
      "logId": 1,
      "loggedType": {
        "name": "",
        "type": 3,
        "typeArguments": []
      }
    },
    {
      "logId": 2,
      "loggedType": {
        "name": "",
        "type": 3,
        "typeArguments": []
      }
    },
    {
      "logId": 3,
      "loggedType": {
        "name": "",
        "type": 7,
        "typeArguments": []
      }
    },
    {
      "logId": 4,
      "loggedType": {
        "name": "",
        "type": 3,
        "typeArguments": []
      }
    },
    {
      "logId": 5,
      "loggedType": {
        "name": "",
        "type": 8,
        "typeArguments": []
      }
    }
  ],
  "messagesTypes": []
}

export class AMMContractAbi__factory {
  static readonly abi = _abi
  static createInterface(): AMMContractAbiInterface {
    return new Interface(_abi) as unknown as AMMContractAbiInterface
  }
  static connect(
    id: string | AbstractAddress,
    walletOrProvider: BaseWalletLocked | Provider
  ): AMMContractAbi {
    return new Contract(id, _abi, walletOrProvider) as unknown as AMMContractAbi
  }
}
