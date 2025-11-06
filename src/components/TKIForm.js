import React, { useState } from "react";
import {
  Box,
  Typography,
  Divider,
  Grid,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  Paper,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  Button,
  InputLabel,
  OutlinedInput
} from "@mui/material";

// Accept a palette so the form can be re-themed consistently
// Expected shape: { primary, hover, panelBg, panelBorder, selectedHover? }
function TKIForm({
  onCalculate,
  onClear,             // <-- NEW: notify parent to clear result
  showHeader = false,
  palette = {
    primary: "#0A6B2E",
    hover: "#085824",
    panelBg: "#E7F4EA",
    panelBorder: "#CBE6D1",
    selectedHover: "#D9F0DF"
  }
}) {
  // ------------------------------
  // NUMERIC FIELDS
  // ------------------------------
  const [age, setAge] = useState("");
  const [bmi, setBmi] = useState("");
  const [lvef, setLvef] = useState("");
  const [gls, setGls] = useState("");
  const [creatinine, setCreatinine] = useState("");

  // ------------------------------
  // SEX (DROPDOWN)
  // ------------------------------
  const [sex, setSex] = useState("");

  // ------------------------------
  // YES/NO FIELDS (Medical History)
  // ------------------------------
  const [htn, setHtn] = useState(false);
  const [metastasis, setMetastasis] = useState(false);
  const [pvd, setPvd] = useState(false);
  const [ckd, setCkd] = useState(false);
  const [cad, setCad] = useState(false);
  const [hyperlipidemia, setHyperlipidemia] = useState(false);

  // ------------------------------
  // SUBMIT / CLEAR
  // ------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      age: Number(age),
      bmi: Number(bmi),
      lvef: Number(lvef),
      gls: Number(gls),
      creatinine: Number(creatinine),
      sex,
      htn,
      metastasis,
      pvd,
      ckd,
      cad,
      hyperlipidemia
    };
    onCalculate(formData);
  };

  const handleClear = () => {
    setAge("");
    setBmi("");
    setLvef("");
    setGls("");
    setCreatinine("");
    setSex("");
    setHtn(false);
    setMetastasis(false);
    setPvd(false);
    setCkd(false);
    setCad(false);
    setHyperlipidemia(false);
    if (onClear) onClear();   // <-- clears the popup in parent
  };

  // ----- Styling helpers (GREEN theme for TKI) -----
  const outlinedBaseSX = {
    borderRadius: 1.5,
    backgroundColor: "#fff",
    "& fieldset": { borderColor: "#CFD8DC" },
    "&:hover fieldset": { borderColor: "#90A4AE" },
    "&.Mui-focused fieldset": { borderColor: palette.primary, borderWidth: 2 }
  };

  const inputSX = {
    "& label.Mui-focused": { color: palette.primary },
    "& .MuiOutlinedInput-root": outlinedBaseSX,
    "& .MuiOutlinedInput-input": { py: 1.25 },
    "& .MuiSelect-icon": { color: palette.primary }
  };

  const radioSX = {
    color: palette.primary,
    "&.Mui-checked": { color: palette.primary }
  };

  const menuPaperSx = {
    "& .MuiMenuItem-root.Mui-selected": {
      backgroundColor: `${palette.panelBg} !important`
    },
    "& .MuiMenuItem-root.Mui-selected:hover": {
      backgroundColor: `${palette.selectedHover || palette.panelBg} !important`
    },
    "& .MuiMenuItem-root.Mui-focusVisible": {
      backgroundColor: `${palette.panelBg} !important`
    }
  };

  const sectionTitleSX = {
    fontWeight: 700,
    fontSize: "1.05rem",
    color: "#263238",
    mb: 0.75
  };

  const formLabelSX = {
    fontWeight: 600,
    color: "#455A64",
    mb: 0.75
  };

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "#E0E0E0",
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: "#FAFAFB"
      }}
    >
      {showHeader && (
        <Box sx={{ bgcolor: palette.primary, color: "#fff", px: 3, py: 2, borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
          <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: 0.2 }}>
            TKI ACE Risk Calculator
          </Typography>
        </Box>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ p: { xs: 2, sm: 3 } }}>
        {/* DEMOGRAPHICS */}
        <Typography sx={sectionTitleSX}>Demographics</Typography>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth required size="small" label="Age" type="number" value={age} onChange={(e) => setAge(e.target.value)} variant="outlined" sx={inputSX} />
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth required size="small" sx={{ ...inputSX }}>
              <InputLabel id="tki-sex-label" sx={{ "&.Mui-focused": { color: palette.primary } }}>
                Sex
              </InputLabel>
              <Select
                labelId="tki-sex-label"
                label="Sex"
                value={sex}
                onChange={(e) => setSex(e.target.value)}
                input={<OutlinedInput label="Sex" sx={outlinedBaseSX} />}
                MenuProps={{ PaperProps: { sx: menuPaperSx } }}
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField fullWidth required size="small" label="BMI" type="number" inputProps={{ step: "0.1" }} value={bmi} onChange={(e) => setBmi(e.target.value)} variant="outlined" sx={inputSX} />
          </Grid>
        </Grid>

        {/* LABS & IMAGING */}
        <Typography sx={sectionTitleSX}>Labs & Imaging</Typography>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth required size="small" label="Creatinine (mg/dL)" type="number" inputProps={{ step: "0.01" }} value={creatinine} onChange={(e) => setCreatinine(e.target.value)} variant="outlined" sx={inputSX} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth required size="small" label="LVEF (%)" type="number" inputProps={{ step: "0.1" }} value={lvef} onChange={(e) => setLvef(e.target.value)} variant="outlined" sx={inputSX} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth required size="small" label="Strain (GLS%)" type="number" inputProps={{ step: "0.1" }} value={gls} onChange={(e) => setGls(e.target.value)} variant="outlined" sx={inputSX} />
          </Grid>
        </Grid>

        {/* MEDICAL HISTORY */}
        <Typography sx={sectionTitleSX}>Medical History</Typography>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend" sx={formLabelSX}>Hypertension (HTN)</FormLabel>
              <RadioGroup row value={htn ? "yes" : "no"} onChange={(e) => setHtn(e.target.value === "yes")}>
                <FormControlLabel value="yes" control={<Radio sx={radioSX} />} label="Yes" />
                <FormControlLabel value="no" control={<Radio sx={radioSX} />} label="No" />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend" sx={formLabelSX}>Metastasis</FormLabel>
              <RadioGroup row value={metastasis ? "yes" : "no"} onChange={(e) => setMetastasis(e.target.value === "yes")}>
                <FormControlLabel value="yes" control={<Radio sx={radioSX} />} label="Yes" />
                <FormControlLabel value="no" control={<Radio sx={radioSX} />} label="No" />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend" sx={formLabelSX}>Peripheral Vascular Disease (PVD)</FormLabel>
              <RadioGroup row value={pvd ? "yes" : "no"} onChange={(e) => setPvd(e.target.value === "yes")}>
                <FormControlLabel value="yes" control={<Radio sx={radioSX} />} label="Yes" />
                <FormControlLabel value="no" control={<Radio sx={radioSX} />} label="No" />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend" sx={formLabelSX}>Chronic Kidney Disease (CKD)</FormLabel>
              <RadioGroup row value={ckd ? "yes" : "no"} onChange={(e) => setCkd(e.target.value === "yes")}>
                <FormControlLabel value="yes" control={<Radio sx={radioSX} />} label="Yes" />
                <FormControlLabel value="no" control={<Radio sx={radioSX} />} label="No" />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend" sx={formLabelSX}>Coronary Artery Disease (CAD)</FormLabel>
              <RadioGroup row value={cad ? "yes" : "no"} onChange={(e) => setCad(e.target.value === "yes")}>
                <FormControlLabel value="yes" control={<Radio sx={radioSX} />} label="Yes" />
                <FormControlLabel value="no" control={<Radio sx={radioSX} />} label="No" />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend" sx={formLabelSX}>Hyperlipidemia</FormLabel>
              <RadioGroup row value={hyperlipidemia ? "yes" : "no"} onChange={(e) => setHyperlipidemia(e.target.value === "yes")}>
                <FormControlLabel value="yes" control={<Radio sx={radioSX} />} label="Yes" />
                <FormControlLabel value="no" control={<Radio sx={radioSX} />} label="No" />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>

        {/* Buttons */}
        <Box sx={{ mt: 1, display: "flex", gap: 1.5 }}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            size="large"
            sx={{
              bgcolor: palette.primary,
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 1.5,
              px: 3,
              "&:hover": { bgcolor: palette.hover }
            }}
          >
            Calculate
          </Button>

          <Button
            type="button"
            size="large"
            variant="outlined"
            onClick={handleClear}
            sx={{
              textTransform: "none",
              borderColor: "#B0BEC5",
              color: "#455A64",
              borderRadius: 1.5,
              px: 3,
              "&:hover": { borderColor: "#90A4AE", bgcolor: "#F5F7F8" }
            }}
          >
            Clear
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

export default TKIForm;
