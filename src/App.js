import React, { useState } from "react";
import { Container, Card, CardContent, Typography, Alert, AlertTitle } from "@mui/material";
import ICIForm from "./components/ICIForm";

function App() {
  const [result, setResult] = useState("");

  // Placeholder for linking to your actual model
  const handleCalculate = (formData) => {
    // For demonstration only
    setResult("22%");
  };

  return (
    <Container maxWidth="md" style={{ marginTop: "2rem", marginBottom: "2rem" }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            ACE Risk Calculator
          </Typography>

          {/* <Typography variant="body1" paragraph>
            Please fill in the details below to estimate the chance of developing an ACE event.
          </Typography> */}

          {/* <Alert severity="info" style={{ marginBottom: "1rem" }}>
            <AlertTitle>Definition: Acute Cardiac Events (ACE)</AlertTitle>
            In this tool, ACE refers to a range of cardiovascular complications observed 
            after immune checkpoint inhibitor (ICI) treatment. The composite ACE outcome 
            includes atrial fibrillation, atrial flutter, supraventricular tachycardia, 
            ventricular arrhythmias, second-degree atrioventricular block, complete heart 
            block, coronary artery disease, congestive heart failure, systolic heart failure, 
            diastolic heart failure, myocardial infarction, mitral valve disease, myocarditis.
          </Alert> */}

          <ICIForm onCalculate={handleCalculate} />

          {/* Display result if any */}
          {result && (
            <Alert severity="info" style={{ marginTop: "1rem" }}>
              <strong>Estimated ACE Risk:</strong> {result}
            </Alert>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}

export default App;
