import React, { useState } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Paper
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ICIForm from "./components/ICIForm";

function App() {
  const [result, setResult] = useState("");

  const weights = {
    age: 0.015,
    sex: { male: 0.05, female: 0.0 },
    bmi: 0.008,
    lvef: -0.002,
    gls: 0.008,
    creatinine: 0.05,
    stroke: 0.015,
    chf: 0.005,
    pvd: 0.03,
    cad: 0.0,
    htn: 0.02,
    lvlge: 0.005,
    dualIci: 0.03,
    cancerMetastasis: 0.025,
    cancerTypes: {
      Breast: 0.005,
      Endocrine: 0.008,
      Genitourinary: 0.002,
      Gastrointestinal: 0.015,
      "Head and Neck": 0.014,
      "Hematologic (Blood)": 0.008,
      Lung: 0.02,
      Neurological: 0.016,
      Skin: 0.009,
      "Soft Tissue/Bone": 0.013,
      Other: 0.011
    },
    baseline: 0.005
  };

  const handleCalculate = (formData) => {
    let raw_logreg_output = -0.6127;

    raw_logreg_output += -0.0273 * formData.lvef;
    raw_logreg_output += +0.0175 * formData.age;
    raw_logreg_output += +0.0745 * formData.bmi;
    raw_logreg_output += +0.1283 * formData.gls;
    raw_logreg_output += +0.4216 * formData.creatinine;

    raw_logreg_output += +0.2496 * (formData.dualIci ? 1 : 0);
    raw_logreg_output += +0.3424 * (formData.lvlge ? 1 : 0);
    raw_logreg_output += +0.102 * (formData.cancerMetastasis ? 1 : 0);
    raw_logreg_output += +0.339 * (formData.sex === "male" ? 1 : 0);

    const cancerTypes = formData.cancerTypes || [];
    raw_logreg_output += -0.4643 * (cancerTypes.includes("Breast") ? 1 : 0);
    raw_logreg_output += +0.0449 * (cancerTypes.includes("Endocrine") ? 1 : 0);
    raw_logreg_output += -0.1727 * (cancerTypes.includes("Gastrointestinal") ? 1 : 0);
    raw_logreg_output += +0.3156 * (cancerTypes.includes("Genitourinary") ? 1 : 0);
    raw_logreg_output += +0.3544 * (cancerTypes.includes("Head and Neck") ? 1 : 0);
    raw_logreg_output += +0.2631 * (cancerTypes.includes("Hematologic (Blood)") ? 1 : 0);
    raw_logreg_output += +0.2302 * (cancerTypes.includes("Lung") ? 1 : 0);
    raw_logreg_output += +0.2421 * (cancerTypes.includes("Neurological") ? 1 : 0);
    raw_logreg_output += +0.1422 * (cancerTypes.includes("Other") ? 1 : 0);
    raw_logreg_output += +0.0275 * (cancerTypes.includes("Skin") ? 1 : 0);
    raw_logreg_output += +0.1602 * (cancerTypes.includes("Soft Tissue/Bone") ? 1 : 0);

    raw_logreg_output += -1.0371 * (formData.stroke ? 1 : 0);
    raw_logreg_output += -0.5987 * (formData.chf ? 1 : 0);
    raw_logreg_output += -0.5034 * (formData.pvd ? 1 : 0);
    raw_logreg_output += -0.3297 * (formData.cad ? 1 : 0);
    raw_logreg_output += +0.1644 * (formData.htn ? 1 : 0);

    const probabilityACE = 1 / (1 + Math.exp(-1 * raw_logreg_output));
    let riskPercentage = Math.round(probabilityACE * 100 * 100) / 100;
    setResult(`${riskPercentage}%`);
  };

  return (
    <Container maxWidth="md" sx={{ mt: "2rem", mb: "2rem" }}>
      <Card>
        <CardContent>
          {/* Unified blue header */}
          <Box
            sx={{
              bgcolor: "#0A3D79",
              color: "#fff",
              px: 3,
              py: 2,
              borderRadius: 2,
              mb: 1
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: 0.2 }}>
              ICI ACE Risk Calculator
            </Typography>
          </Box>

          {/* Description block in lighter, harmonious blue */}
          <Paper
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "#C9D6E5",
              borderRadius: 2,
              bgcolor: "#E6EEF7",
              p: { xs: 2, sm: 3 },
              mb: 2
            }}
          >
            <Typography variant="body1" color="textSecondary">
              This tool estimates the risk of adverse cardiovascular events (ACE) in cancer
              patients receiving immune checkpoint inhibitor (ICI) therapy. It is based on a
              machine learning–derived algorithm that integrates clinical, imaging, and
              oncologic features to provide an individualized probability of ACE.
              The calculator is designed for research and educational use to support risk
              stratification in this high-risk population.
            </Typography>
          </Paper>

          {/* Input form (header hidden) */}
          <ICIForm onCalculate={handleCalculate} showHeader={false} />

          {/* Result */}
          {result && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <strong>Estimated ACE Risk:</strong> {result}
            </Alert>
          )}

          {/* "What counts as ACE?" */}
          <Accordion sx={{ mt: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" fontWeight="bold">
                What counts as ACE?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="textSecondary">
                Adverse cardiovascular events (ACE) include myocardial infarction, coronary
                artery disease, arrhythmias (atrial fibrillation, atrial flutter, SVT,
                ventricular tachycardia/fibrillation, advanced degree atrioventricular
                blocks, bradyarrhythmias), heart failure, valvular disease, and myocarditis.
              </Typography>
            </AccordionDetails>
          </Accordion>

          {/* Persistent disclaimer */}
          <Box mt={2}>
            <Alert severity="warning">
              <Typography variant="body2" color="textPrimary">
                <strong>Disclaimer:</strong> This tool is an investigational risk model for
                adverse cardiovascular events (ACE) among patients receiving immune
                checkpoint inhibitor (ICI) therapy. It is provided for research and
                educational purposes currently and is undergoing further
                evaluation/validation for clinical use.
              </Typography>
            </Alert>
          </Box>

          {/* Footnote */}
          <Typography
            variant="body2"
            color="textSecondary"
            align="center"
            sx={{ mt: 2, fontStyle: "italic" }}
          >
            Developed by the Kwan Lab at Yale University
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}

export default App;
