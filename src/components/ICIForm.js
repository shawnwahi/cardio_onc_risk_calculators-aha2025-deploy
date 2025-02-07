import React, { useState } from "react";
import {
  Grid,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  Button,
  InputLabel,
  OutlinedInput,
  Box
} from "@mui/material";

function ICIForm({ onCalculate }) {
  const [age, setAge] = useState("");
  const [bmi, setBmi] = useState("");
  const [lvef, setLvef] = useState("");

  const [sex, setSex] = useState("");
  const [htn, setHtn] = useState(false);
  const [dualIci, setDualIci] = useState(false);

  // LV DGE is now a single selection
  const dgeOptions = ["N/A", "Midmyocardial", "Subendocardial", "Transmural"];
  const [lvDge, setLvDge] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      age: Number(age),
      bmi: Number(bmi),
      lvef: Number(lvef),
      sex,
      htn,
      dualIci,
      lvDge
    };
    onCalculate(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        {/* AGE */}
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            required
            label="Age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            variant="outlined"
          />
        </Grid>

        {/* BMI */}
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            required
            label="BMI"
            type="number"
            inputProps={{ step: "0.1" }}
            value={bmi}
            onChange={(e) => setBmi(e.target.value)}
            variant="outlined"
          />
        </Grid>

        {/* LVEF */}
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            required
            label="LVEF (%)"
            type="number"
            inputProps={{ step: "0.1" }}
            value={lvef}
            onChange={(e) => setLvef(e.target.value)}
            variant="outlined"
          />
        </Grid>

        {/* SEX */}
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth required>
            <InputLabel id="sex-label">Sex</InputLabel>
            <Select
              labelId="sex-label"
              label="Sex"
              value={sex}
              onChange={(e) => setSex(e.target.value)}
              input={<OutlinedInput label="Sex" />}
            >
              <MenuItem value="">Select</MenuItem>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* HTN (Radio) */}
        <Grid item xs={12} sm={4}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Hypertension (HTN)</FormLabel>
            <RadioGroup
              row
              value={htn ? "yes" : "no"}
              onChange={(e) => setHtn(e.target.value === "yes")}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </Grid>

        {/* Dual ICI (Radio) */}
        <Grid item xs={12} sm={4}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Dual ICI</FormLabel>
            <RadioGroup
              row
              value={dualIci ? "yes" : "no"}
              onChange={(e) => setDualIci(e.target.value === "yes")}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </Grid>

        {/* LV DGE (RadioGroup for single select) */}
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">LV DGE (Select one)</FormLabel>
            <RadioGroup
              row
              name="lvDge"
              value={lvDge}
              onChange={(e) => setLvDge(e.target.value)}
            >
              {dgeOptions.map((option) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Grid>

        {/* SUBMIT BUTTON */}
        <Grid item xs={12}>
          <Button variant="contained" color="primary" type="submit">
            Calculate
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ICIForm;
