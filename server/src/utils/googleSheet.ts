import { google } from "googleapis";

export const addToGoogleSheet = async (lead: any) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "./google.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: "1jBPLrDLY0JGeoGiWSh__sv_HdVpgRYezo37BZvmrtCs",
    range: "Sheet1!A1",
    valueInputOption: "RAW",
    requestBody: {
      values: [
        [
          lead.name,
          lead.email,
          lead.mobile,
          lead.service,
          lead.description,
          lead.utm_source,
          lead.utm_medium,
          lead.utm_campaign,
        ],
      ],
    },
  });
};
