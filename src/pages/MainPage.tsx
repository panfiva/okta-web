import { Fragment, useState, useEffect, Dispatch, SetStateAction } from "react";
import { useForm, Controller } from "react-hook-form";
import MuiInput from "@mui/material/TextField";
import Box from "@mui/material/Box";
import SelectMui from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import FormHelperText from "@mui/material/FormHelperText";
import axios from "axios";
import { useOktaAuth } from "@okta/okta-react";

function Input({ label, name, errors, required, control }) {
  const isError = !!errors?.[name];
  return (
    <Box p={1}>
      <Controller
        name={name}
        control={control}
        rules={{ required }}
        render={({ field }) => (
          <Fragment>
            <FormControl fullWidth>
              <MuiInput
                {...field}
                error={!!errors?.[name]}
                placeholder={label}
                variant="outlined"
                label={label}
                helperText={isError && required && "Required value"}
              />
            </FormControl>
          </Fragment>
        )}
      />
    </Box>
  );
}

function Select({ label, name, errors, required, control }) {
  const isError = !!errors?.[name];

  return (
    <Box p={1}>
      <Controller
        name={name}
        control={control}
        rules={{ required }}
        render={({ field }) => (
          <FormControl fullWidth error={isError}>
            <InputLabel id="demo-simple-select-label">{label}</InputLabel>
            <SelectMui
              {...field}
              placeholder={label}
              label={label}
              variant="outlined"
            >
              <MenuItem value="Java">JavaScript</MenuItem>
              <MenuItem value="Python">Python</MenuItem>
              <MenuItem value="PHP">PHP</MenuItem>
            </SelectMui>
            <FormHelperText>
              {isError && required && "Required value"}
            </FormHelperText>
          </FormControl>
        )}
      />
    </Box>
  );
}

async function submitRequest(props: {
  data: any;
  setResponse: Dispatch<SetStateAction<string>>;
  token: string;
}) {
  const url = `https://${window.location.hostname}:5000`;

  const date = new Date();
  const dt = date.toLocaleString("en-US");
  props.data.dt = dt;

  const options = {
    headers: {
      Authorization: `Bearer ${props.token}`,
      Accept: "application/json",
    },
    // params: {}, // not used
  };

  const apiRet = await axios.post(url, props.data, options).catch((e: any) => {
    console.log({ e });
    props.setResponse(
      JSON.stringify(
        { error: e.response.data.error, code: e.response.status },
        null,
        2
      )
    );
    throw e;
  });


  const { firstName, lastName, language } = apiRet.data;

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const d = new Date(date);

  const mm = d.getMonth();

  props.setResponse(
    `Hi, ${firstName} ${lastName}. I also like ${language}, especially in ${monthNames[mm]}. `
  );
}

export const Protected = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitSuccessful, submitCount },
    control,
  } = useForm({ defaultValues: { firstName: "", lastName: "", lang: "" } });

  const [response, setResponse] = useState<string>("");

  useEffect(() => {
    if (submitCount > 0 && isSubmitSuccessful === false)
      setResponse("Form submission failed");
  }, [isSubmitSuccessful, submitCount]);

  const { oktaAuth } = useOktaAuth();

  const handleLogout = () => oktaAuth.signOut();

  const token = oktaAuth.getIdToken();

  const onSubmit = (data) => {
    submitRequest({ data, setResponse, token });
  };

  return (
    <Box p={2} width="300px">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="First Name"
          required
          name="firstName"
          errors={errors}
          control={control}
        />

        <Input
          label="Last Name"
          required
          name="lastName"
          errors={errors}
          control={control}
        />

        <Select
          label="Programming Langugage"
          required
          name="lang"
          errors={errors}
          control={control}
        />

        <input type="submit" />
      </form>
      <Box p={1}>
        <h1>API Response</h1>
        <pre>{response}</pre>
      </Box>

      <footer>
        <hr />
        {
          <>
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          </>
        }
      </footer>
    </Box>
  );
};

export default Protected;
