import React, { useState } from "react";
import { Container, Card, CardContent, Typography, Alert } from "@mui/material";
import ICIForm from "./components/ICIForm";

function App() {
  const [result, setResult] = useState("");

  // Placeholder for linking to your actual XGBoost model
  const handleCalculate = (formData) => {
    // Example only:
    setResult("Placeholder result: ~12% risk of ACE");
  };

  return (
    <Container maxWidth="md" style={{ marginTop: "2rem", marginBottom: "2rem" }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            ICI Risk Calculator
          </Typography>
          <Typography variant="body1" paragraph>
            Please fill in the details below to calculate your ACE risk.
          </Typography>

          <ICIForm onCalculate={handleCalculate} />

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
