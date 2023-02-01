import { extendTheme } from "@chakra-ui/react"
import {Button} from "./button"

export const theme = extendTheme({
    colors: {
      brand: {
        100: "#FF3c00"
      },
    },
    fonts: {
        body: "Open Sans, sans-sherif"
    },
    styles: {
        global: () => ({
            body: {
                bg: "gray.200"
            }
        }),
    },
    components: {
        Button
    }
  });