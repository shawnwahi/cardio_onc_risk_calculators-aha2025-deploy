import React, { useState } from "react";
import { Container, Card, CardContent, Typography, Alert, AlertTitle } from "@mui/material";
import ICIForm from "./components/ICIForm";

function App() {
  const [result, setResult] = useState("");

  // Placeholder for linking to your actual XGBoost model
  const handleCalculate = (formData) => {
    // For demonstration only
    setResult("Placeholder result: ~12% risk of ACE based on your inputs");
  };

  return (
    <Container maxWidth="md" style={{ marginTop: "2rem", marginBottom: "2rem" }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            ICI Risk Calculator
          </Typography>

          {/* Short instructions */}
          <Typography variant="body1" paragraph>
            Please fill in the details below to estimate the chance of developing an ACE event.
          </Typography>

          {/* ACE definition */}
          <Alert severity="info" style={{ marginBottom: "1rem" }}>
            <AlertTitle>Definition: Acute Cardiac Events (ACE)</AlertTitle>
            In this tool, ACE refers to a range of cardiovascular complications 
            observed after immune checkpoint inhibitor (ICI) treatment. Specifically, 
            we consider events such as post-treatment atrial fibrillation, atrial flutter, 
            various other arrhythmias, second-degree atrioventricular block, coronary artery disease, 
            additional cardiac arrhythmias, complete heart block, congestive heart failure, 
            diastolic heart failure, myocardial infarction, mitral valve complications, myocarditis, 
            supraventricular tachycardia, systolic heart failure, ventricular fibrillation, 
            and ventricular tachycardia.
          </Alert>

          <ICIForm onCalculate={handleCalculate} />

          {/* Display result if any */}
          {result && (
            <Alert severity="info" style={{ marginTop: "1rem" }}>
              <strong>Result:</strong> {result}
            </Alert>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}

export default App;
