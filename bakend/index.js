const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

// налаштування з'єднання з postgres
const pool = new Pool({
  host: "127.0.0.1",
  user: "isd",
  password: "tomcat",
  database: "sdk_3101",
  port: 5432
});

// ----------------- Ендпоінт для солдата -----------------
app.post("/api/soldiers", async (req, res) => {
  try {
    const s = req.body;
    const result = await pool.query(
      `INSERT INTO personals (
        surname, name, patronymic, birth_date, birth_place,
        home_address, phone_numbers, registration_address, draft_date,
        drafted_by, service_type, consent_signature, consent_period,
        position, military_ticket_series, passport_series, passport_issued_by,
        id_number, marital_status, tax_id, personal_number,
        ubd_status, ubd_issued_by, ubd_issue_date, state_awards, injuries,
        driver_license, personal_vehicle, criminal_offenses, administrative_offenses
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
        $11,$12,$13,$14,$15,$16,$17,$18,$19,$20,
        $21,$22,$23,$24,$25,$26,$27,$28,$29,$30
      ) RETURNING id`,
      [
        s.surname, s.name, s.patronymic, s.birth_date, s.birth_place,
        s.home_address, s.phone_numbers, s.registration_address, s.draft_date,
        s.drafted_by, s.service_type, s.consent_signature, s.consent_period,
        s.position, s.military_ticket_series, s.passport_series, s.passport_issued_by,
        s.id_number, s.marital_status, s.tax_id, s.personal_number,
        s.ubd_status, s.ubd_issued_by, s.ubd_issue_date, s.state_awards, s.injuries,
        s.driver_license, s.personal_vehicle, s.criminal_offenses, s.administrative_offenses
      ]
    );

    res.json({ success: true, id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ----------------- Ендпоінт для членів сім’ї -----------------
app.post("/api/family", async (req, res) => {
  try {
    const f = req.body;
    await pool.query(
      `INSERT INTO family_members (
        soldier_id, relationship, full_name, birth_date, workplace,
        home_address, phone_numbers
      ) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [
        f.soldier_id, f.relationship, f.full_name, f.birth_date,
        f.workplace, f.home_address, f.phone_numbers
      ]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});


app.listen(3001, () => console.log("API running on http://localhost:3001"));