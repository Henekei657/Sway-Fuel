import { Button, Flex, Stack } from "@fuel-ui/react";
import {
  InputFieldComponent,
  InputNumberComponent,
  RadioGroupComponent,
} from "../../common/components";
import { useIsConnected } from "../../core/hooks";

interface BuyerDeadlineInterface {
  setBuyer: (address: string) => void;
  setDeadline: (amount: number) => void;
  setRecipient: (address: string) => void;
  setPage: (page: number) => void;
  currentPage: number;
}

export function BuyerDeadlinePage({
  setBuyer,
  setDeadline,
  setRecipient,
  setPage,
  currentPage,
}: BuyerDeadlineInterface) {
  const isConnected = useIsConnected();

  return (
    <Stack css={{ marginLeft: "auto", marginRight: "auto", width: "40%" }}>
      <InputFieldComponent
        onChange={setBuyer}
        text="Buyer address"
        placeholder="0x80d5e8c2be..."
      />

      <InputNumberComponent
        onChange={setDeadline}
        text="Deadline (block height)"
        placeholder="621"
      />

      <RadioGroupComponent text="Buyer" handler={setRecipient} />

      <Flex gap="$1" css={{ marginTop: "$10" }}>
        <Button
          color="accent"
          onPress={() => setPage(currentPage - 1)}
          size="lg"
          variant="solid"
          isDisabled={!isConnected}
          css={{
            fontWeight: "$semibold",
            background: "hsl(128deg 90% 38% / 91%)",
            color: "$blackA12",
            width: "100%",
            border: "1px solid black",
          }}
        >
          Back
        </Button>

        <Button
          color="accent"
          onPress={() => setPage(currentPage + 1)}
          size="lg"
          variant="solid"
          isDisabled={!isConnected}
          css={{
            fontWeight: "$semibold",
            background: "hsl(128deg 90% 38% / 91%)",
            color: "$blackA12",
            width: "100%",
            border: "1px solid black",
          }}
        >
          Next
        </Button>
      </Flex>
    </Stack>
  );
}
