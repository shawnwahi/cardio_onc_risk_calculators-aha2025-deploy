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
  Paper,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  IconButton,
  useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ScienceIcon from "@mui/icons-material/Science";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ICIForm from "./components/ICIForm";
import TKIForm from "./components/TKIForm";
import APP_CONFIG from "./config";

const drawerWidth = 260;

// Centralized palettes (keeps relative shade offsets consistent)
const PALETTE = {
  blue: {
    primary: "#0A3D79",
    hover: "#083363",
    panelBg: "#E6EEF7",
    panelBorder: "#C9D6E5",
    selectedHover: "#DBE7F2"
  },
  green: {
    primary: "#0A6B2E",
    hover: "#085824",
    panelBg: "#E7F4EA",
    panelBorder: "#CBE6D1",
    selectedHover: "#D9F0DF"
  },
  neutral: {
    sidebarHeaderBg: "#455A64",
    sidebarHeaderText: "#FFFFFF"
  }
};

function App() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  // default calculator from config (tki | ici)
  const validCalcs = ["ici", "tki"];
  const configDefault =
    (APP_CONFIG?.defaultCalculator || "ici").toString().toLowerCase();
  const initialCalc = validCalcs.includes(configDefault) ? configDefault : "ici";

  const [activeCalc, setActiveCalc] = useState(initialCalc);
  const [iciResult, setIciResult] = useState("");
  const [tkiResult, setTkiResult] = useState("");

  // Sidebar visibility states
  const [desktopOpen, setDesktopOpen] = useState(true); // default open on desktop
  const [mobileOpen, setMobileOpen] = useState(false);  // default closed on mobile

  // ----- ICI calculator (unchanged math) -----
  const handleCalculateICI = (formData) => {
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
    setIciResult(`${riskPercentage}%`);
  };

  // ---------- TKI calculator (UPDATED coefficients) ----------
  const TKI_COEF = {
    intercept: -0.4905,
    bmi: 0.0451,
    age: 0.0202,
    sexMale: 0.2359,
    lvef: -0.0505,
    abnormalLvef: 0.0347,
    htn: 0.4181,
    metastasis: 0.3556,
    pvd: 0.5754,
    creatinine: -0.1772,
    gls: 0.0282,
    ckd: 0.0779,
    cad: 0.0846,
    hyperlipidemia: 0.1150
  };

  const handleCalculateTKI = (formData) => {
    const threshold = APP_CONFIG?.tki?.lvefAbnormalThreshold ?? 40;
    const isAbnormalLVEF = Number.isFinite(formData.lvef) && formData.lvef < threshold;

    let s = TKI_COEF.intercept;

    // Continuous terms
    s += TKI_COEF.bmi * formData.bmi;
    s += TKI_COEF.age * formData.age;
    s += TKI_COEF.lvef * formData.lvef;
    s += TKI_COEF.creatinine * formData.creatinine;
    s += TKI_COEF.gls * formData.gls;

    // Indicator terms
    s += TKI_COEF.sexMale * (formData.sex === "male" ? 1 : 0);
    s += TKI_COEF.abnormalLvef * (isAbnormalLVEF ? 1 : 0);
    s += TKI_COEF.htn * (formData.htn ? 1 : 0);
    s += TKI_COEF.metastasis * (formData.metastasis ? 1 : 0);
    s += TKI_COEF.pvd * (formData.pvd ? 1 : 0);
    s += TKI_COEF.ckd * (formData.ckd ? 1 : 0);
    s += TKI_COEF.cad * (formData.cad ? 1 : 0);
    s += TKI_COEF.hyperlipidemia * (formData.hyperlipidemia ? 1 : 0);

    const probabilityACE = 1 / (1 + Math.exp(-s));
    const riskPercentage = Math.round(probabilityACE * 100 * 100) / 100;
    setTkiResult(`${riskPercentage}%`);
  };

  // ----- ICI page -----
  const renderICI = () => (
    <Container maxWidth="md" sx={{ mt: "2rem", mb: "2rem" }}>
      <Card>
        <CardContent>
          <Box sx={{ bgcolor: PALETTE.blue.primary, color: "#fff", px: 3, py: 2, borderRadius: 2, mb: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: 0.2 }}>
              ICI ACE Risk Calculator
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: PALETTE.blue.panelBorder,
              borderRadius: 2,
              bgcolor: PALETTE.blue.panelBg,
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

          <ICIForm
            onCalculate={handleCalculateICI}
            onClear={() => setIciResult("")}
            showHeader={false}
          />

          {iciResult && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <strong>Estimated ACE Risk:</strong> {iciResult}
            </Alert>
          )}

          <Accordion sx={{ mt: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" fontWeight="bold">ACE Definition</Typography>
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
        </CardContent>
      </Card>
    </Container>
  );

  // ----- TKI page -----
  const renderTKI = () => (
    <Container maxWidth="md" sx={{ mt: "2rem", mb: "2rem" }}>
      <Card>
        <CardContent>
          <Box sx={{ bgcolor: PALETTE.green.primary, color: "#fff", px: 3, py: 2, borderRadius: 2, mb: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: 0.2 }}>
              TKI ACE Risk Calculator
            </Typography>
          </Box>

      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: PALETTE.green.panelBorder,
          borderRadius: 2,
          bgcolor: PALETTE.green.panelBg,
          p: { xs: 2, sm: 3 },
          mb: 2
        }}
      >
        <Typography variant="body1" color="textSecondary">
          This tool estimates the risk of adverse cardiovascular events (ACE) in cancer
          patients receiving tyrosine kinase inhibitor (TKI) therapy. It is based on a
          machine learning–derived algorithm that integrates clinical, imaging, and
          oncologic features to provide an individualized probability of ACE.
          The calculator is designed for research and educational use to support risk
          stratification in this high-risk population.
        </Typography>
      </Paper>

          <TKIForm
            onCalculate={handleCalculateTKI}
            onClear={() => setTkiResult("")}
            showHeader={false}
            palette={PALETTE.green}
          />

          {tkiResult && (
            <Alert
              severity="info"
              sx={{
                mt: 2,
                bgcolor: PALETTE.green.panelBg,
                border: "1px solid",
                borderColor: PALETTE.green.panelBorder,
                color: "inherit",
                "& .MuiAlert-icon": { color: PALETTE.green.primary }
              }}
            >
              <strong>Estimated ACE Risk:</strong> {tkiResult}
            </Alert>
          )}

          <Accordion sx={{ mt: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" fontWeight="bold">ACE Definition</Typography>
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

          <Box mt={2}>
            <Alert severity="warning">
              <Typography variant="body2" color="textPrimary">
                <strong>Disclaimer:</strong> This tool is an investigational risk model for
                adverse cardiovascular events (ACE) among patients receiving tyrosine kinase
                inhibitor (TKI) therapy. It is provided for research and educational purposes
                currently and is undergoing further evaluation/validation for clinical use.
              </Typography>
            </Alert>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );

  // ----- Build label from config -----
  const buildLabelMap = { stable: "Stable Build", dev: "Dev Build" };
  const footerLabel = `Version ${APP_CONFIG.version} (${APP_CONFIG.versionDateMonthYear}) • ${buildLabelMap[APP_CONFIG.buildTier] || "Build"}`;

  // Common drawer content (used by both desktop & mobile drawers)
  const DrawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header with collapse button */}
      <Box
        sx={{
          bgcolor: PALETTE.neutral.sidebarHeaderBg,
          color: PALETTE.neutral.sidebarHeaderText,
          px: 2,
          py: 1.25,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 0.2, lineHeight: 1.2 }}>
          Risk Calculators
        </Typography>
        <IconButton
          aria-label="Close sidebar"
          size="small"
          onClick={() => (isDesktop ? setDesktopOpen(false) : setMobileOpen(false))}
          sx={{ color: "#fff" }}
        >
          <ChevronLeftIcon />
        </IconButton>
      </Box>

      {/* Byline under header */}
      <Box sx={{ px: 2, py: 1, bgcolor: "#F5F7F8", borderBottom: "1px solid #e0e0e0" }}>
        <Typography variant="caption" sx={{ color: "text.secondary", fontStyle: "italic" }}>
          Developed by the Kwan Lab at Yale University
        </Typography>
      </Box>

      <List>
        <ListItemButton
          selected={activeCalc === "ici"}
          onClick={() => {
            setActiveCalc("ici");
            if (!isDesktop) setMobileOpen(false);
          }}
          sx={{
            "&.Mui-selected": { backgroundColor: PALETTE.blue.panelBg },
            "&.Mui-selected:hover": { backgroundColor: PALETTE.blue.selectedHover }
          }}
        >
          <ListItemIcon sx={{ color: activeCalc === "ici" ? PALETTE.blue.primary : "inherit" }}>
            <ScienceIcon />
          </ListItemIcon>
          <ListItemText primary="ICI ACE Risk" />
        </ListItemButton>

        <ListItemButton
          selected={activeCalc === "tki"}
          onClick={() => {
            setActiveCalc("tki");
            if (!isDesktop) setMobileOpen(false);
          }}
          sx={{
            position: "relative",
            "&.Mui-selected": { backgroundColor: PALETTE.green.panelBg },
            "&.Mui-selected:hover": { backgroundColor: PALETTE.green.selectedHover }
          }}
        >
          <ListItemIcon sx={{ color: activeCalc === "tki" ? PALETTE.green.primary : "inherit" }}>
            <FavoriteBorderIcon />
          </ListItemIcon>
          <ListItemText primary="TKI ACE Risk" />
          {APP_CONFIG.flags.showNewBadgeOnTKI && (
            <Box sx={{ position: "absolute", top: 8, right: 12, pointerEvents: "none", zIndex: 1 }}>
              <Chip
                label="NEW"
                size="small"
                sx={{
                  bgcolor: PALETTE.green.primary,
                  color: "#fff",
                  height: 18,
                  fontWeight: 700,
                  letterSpacing: 0.3
                }}
              />
            </Box>
          )}
        </ListItemButton>
      </List>

      <Divider sx={{ mt: "auto" }} />
      <Box sx={{ p: 2 }}>
        <Typography
          variant="caption"
          sx={{ color: "text.secondary", fontFamily: '"Helvetica Neue", Arial, sans-serif' }}
        >
          {footerLabel}
        </Typography>
      </Box>
    </Box>
  );

  // Floating menu button (mobile: always visible when drawer closed; desktop: visible when collapsed)
  const showMenuButton =
    (isDesktop && !desktopOpen) || (!isDesktop && !mobileOpen);

  const handleMenuButtonClick = () =>
    isDesktop ? setDesktopOpen(true) : setMobileOpen(true);

  return (
    <Box sx={{ display: "flex" }}>
      {/* DESKTOP drawer (≥ md): collapsible, inline */}
      {isDesktop && desktopOpen && (
        <Drawer
          variant="permanent"
          anchor="left"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              borderRight: "1px solid #e0e0e0",
              backgroundColor: "#FFFFFF"
            }
          }}
          open
        >
          {DrawerContent}
        </Drawer>
      )}

      {/* MOBILE drawer (< md): temporary overlay */}
      {!isDesktop && (
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }} // better performance on mobile
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              borderRight: "1px solid #e0e0e0",
              backgroundColor: "#FFFFFF"
            }
          }}
        >
          {DrawerContent}
        </Drawer>
      )}

      {/* Floating menu / hamburger button */}
      {showMenuButton && (
        <Box
          sx={{
            position: "fixed",
            top: 12,
            left: 12,
            zIndex: (t) => t.zIndex.drawer + 1
          }}
        >
          <IconButton
            aria-label="Open sidebar"
            onClick={handleMenuButtonClick}
            size="large"
            sx={{
              bgcolor: "#FFFFFF",
              border: "1px solid #e0e0e0",
              boxShadow: 1,
              "&:hover": { bgcolor: "#FAFAFB" }
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      )}

      {/* MAIN: centered content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          px: { xs: 1.5, sm: 3 }
        }}
      >
        {activeCalc === "ici" ? renderICI() : renderTKI()}
      </Box>
    </Box>
  );
}

export default App;
