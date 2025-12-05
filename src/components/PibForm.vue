<template>
<div class="card" :class="{ disabled: isLoading }" ref="pdfArea">

    <h1 class="title">
      <button class="add-row" @click="loadSoldier">
        СОЦІАЛЬНО - ДЕМОГРАФІЧНА КАРТКА НА ВІЙСЬКОВОСЛУЖБОВЦЯ
      </button>
    </h1>

    <!-- Верхній блок -->
    <div class="top-section">

      <div ref="photoBox" class="photo-box">
        <img v-if="photoPreview" :src="photoPreview" class="photo" />
        <div v-else class="photo-placeholder">Фото</div>

        <label class="upload-btn">
          Додати/Оновити
          <input type="file" @change="onPhotoUpload" />
        </label>
      </div>

      <div class="main-info">

        <div class="field" :class="{ invalid: !soldier.last_name && triedSubmit }"><label>Прізвище:</label> <input v-model="soldier.last_name" /></div>
        <div class="field" :class="{ invalid: !soldier.first_name && triedSubmit }"><label>Ім’я:</label> <input v-model="soldier.first_name" /></div>
        <div class="field" :class="{ invalid: !soldier.middle_name && triedSubmit }"><label>По батькові:</label> <input v-model="soldier.middle_name" /></div>
        <div class="field" :class="{ invalid: !soldier.birth_info && triedSubmit }"><label>Дата народження:</label> <input type="date" v-model="soldier.birth_info" /></div>
        <div class="field" :class="{ invalid: !soldier.phone_nums && triedSubmit }"><label>Номер телефону:</label> <input v-model="soldier.phone_nums" /></div>

        <div class="field" :class="{ invalid: !soldier.home_address && triedSubmit }"><label>Адреса проживання:</label>
          <textarea v-model="soldier.home_address" @input="autoResize($event)" rows="1" style="overflow:hidden; resize:none;"></textarea>
        </div>

        <div class="field" :class="{ invalid: !soldier.registration_address && triedSubmit }"><label>Адреса реєстрації:</label>
          <textarea v-model="soldier.registration_address" @input="autoResize($event)" rows="1" style="overflow:hidden; resize:none;"></textarea>
        </div>

        <div class="field" :class="{ invalid: !soldier.when_called && triedSubmit }"><label>Коли призваний:</label> <input type="date" v-model="soldier.when_called" /></div>
        <div class="field" :class="{ invalid: !soldier.who_called && triedSubmit }"><label>Ким призваний:</label> <input v-model="soldier.who_called" /></div>

        <div class="field" :class="{ invalid: !soldier.service_type && triedSubmit }">
          <label>Вид служби:</label>
          <select v-model="soldier.service_type">
            <option disabled value="">Оберіть вид служби</option>
            <option value="kontrakt">За контрактом</option>
            <option value="mob">Призов під час мобілізації</option>
          </select>
        </div>

      </div>
    </div>

    <!-- Нижній блок -->
    <div class="bottom-section">

      <div class="field" style="text-align:left">
        Я,____________________________________, надаю згоду для опрацювання своїх персональних даних офіцерам НГУ на період проходження служби. _____________ (підпис)
      </div>
      <div class="field" :class="{ invalid: !soldier.military_ticket && triedSubmit }"><label>Військове звання:</label> <input v-model="soldier.military_rank" /></div>

      <div class="field" :class="{ invalid: !soldier.position && triedSubmit }">
        <label>Займана посада:</label>
        <textarea v-model="soldier.position" @input="autoResize($event)" rows="1" style="overflow:hidden; resize:none;"></textarea>
      </div>

      <div class="field" :class="{ invalid: !soldier.military_ticket && triedSubmit }"><label>Серія і номер військового квитка:</label> <input v-model="soldier.military_ticket" /></div>
      <div class="field" :class="{ invalid: !soldier.passport && triedSubmit }"><label>Паспорт:</label> <input v-model="soldier.passport" /></div>

      <div class="field" :class="{ invalid: !soldier.family_status && triedSubmit }">
        <label>Сімейний стан:</label>
        <select v-model="soldier.family_status">
          <option disabled value="">Оберіть cімейний стан</option>
          <option value="type1">Одружений/Заміжня</option>
          <option value="type2">Неодружений/Незаміжня</option>
          <option value="type3">Розлучений(на)</option>
          <option value="type4">Вдівець/Вдова</option>
          <option value="type4">Цивільний шлюб</option>
        </select>
      </div>

      <div class="field" :class="{ invalid: !soldier.tax_id && triedSubmit }">
        <label>Ідентифікаційний код:</label> <input v-model="soldier.tax_id" @input="onInn"/></div>

      <div class="field" :class="{ invalid: !soldier.personal_number && triedSubmit }">
        <label>Особовий номер (жетон):</label>
        <input v-model="soldier.personal_number" @input="onPersonalNumberInput" />
      </div>

      <!-- УБД -->
      <div class="field" :class="{ invalid: soldier.ubd_status && triedSubmit && (!soldier.ubd_data || !soldier.ubd_date)}">
        <label><input type="checkbox" v-model="soldier.ubd_status" />Наявність УБД:</label>

        <label style="text-align: right">Серія, №, ким виданий:</label>
        <input v-model="soldier.ubd_data" :disabled="!soldier.ubd_status" />

        <label style="text-align:right">Дата видачі УБД:</label>
        <input type="date" v-model="soldier.ubd_date" :disabled="!soldier.ubd_status" />
      </div>

      <!-- Інше -->
      <div class="field"><label><input type="checkbox" v-model="soldier.is_awards" />Державні нагороди:</label> <input v-model="soldier.awards" :disabled="!soldier.is_awards" /></div>
      <div class="field"><label><input type="checkbox" v-model="soldier.is_injuries"/>Отримані поранення:</label> <input v-model="soldier.injuries" :disabled="!soldier.is_injuries" /></div>
      <div class="field"><label><input type="checkbox" v-model="soldier.is_driver_license"/>Водійське посвідчення:</label> <input v-model="soldier.driver_license" :disabled="!soldier.is_driver_license" /></div>

      <div class="field">
        <label><input type="checkbox" v-model="soldier.is_vehicle"/>Наявність особист. ТЗ:</label>
        <label style="text-align: right;">Марка:</label><input v-model="soldier.vehicle" :disabled="!soldier.is_vehicle" />
        <label style="text-align: right;">Номер:</label><input v-model="soldier.num_vehicle" :disabled="!soldier.is_vehicle" />
      </div>

      <div class="field"><label><input type="checkbox" v-model="soldier.is_criminal_records"/>Кримінальні правопорушення:</label> <input v-model="soldier.criminal_records" :disabled="!soldier.is_criminal_records" /></div>
      <div class="field"><label><input type="checkbox" v-model="soldier.is_admin_records"/>Адміністративні правопорушення:</label> <input v-model="soldier.admin_records" :disabled="!soldier.is_admin_records" /></div>
      <div class="field"><label><input type="checkbox" v-model="soldier.is_before_service_records"/>Правопорушення до служби:</label> <input v-model="soldier.before_service_records" :disabled="!soldier.is_before_service_records" /></div>

      <h3 class="family-title">Склад сім’ї:<button class="add-row" @click="addFamilyRow">+</button></h3>

      <div class="family-wrapper">
        <table class="family-table">
          <thead>
            <tr>
              <th>Спорідне-<br>ність</th>
              <th>П.І.Б</th>
              <th>Дата народж.</th>
              <th>Місце роботи</th>
              <th>Адреса проживання</th>
              <th>Номер телефону</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(member, i) in soldier.family" :key="i">

              <td><input style="width:70px" v-model="member.relation" :class="{ invalid: triedSubmit && !member.relation }"></td>

              <td><textarea v-model="member.fullname" @input="autoResize($event)" rows="1" style="overflow:hidden; resize:none; width:180px" :class="{ invalid: triedSubmit && !member.fullname }"></textarea></td>

              <td><input type="date" v-model="member.birth_date" :class="{ invalid: triedSubmit && !member.birth_date }"></td>

              <td><textarea v-model="member.workplace" @input="autoResize($event)" rows="1" style="overflow:hidden; resize:none; width:100px" :class="{ invalid: triedSubmit && !member.workplace }"></textarea></td>

              <td><textarea v-model="member.address" @input="autoResize($event)" rows="1" style="overflow:hidden; resize:none; width:240px" :class="{ invalid: triedSubmit && !member.address }"></textarea></td>

              <td><textarea v-model="member.phone" @input="autoResize($event)" rows="1" style="overflow:hidden; resize:none; width:110px" :class="{ invalid: triedSubmit && !member.phone }"></textarea></td>

            </tr>
          </tbody>
        </table>
      </div>


    </div>

    <button class="save-btn" @click="save">Зберегти</button>
    <button class="save-btn" @click="savePdf">Експорт в PDF</button>

    <!-- OVERLAY -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loader">Зачекайте…</div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

const API_URL = import.meta.env.VITE_API_URL || "";

const triedSubmit = ref(false)
const photoPreview = ref(null)
const isLoading = ref(false)
const pdfArea = ref(null)

const photoBox = ref(null);
let boxWidth = 0;
let boxHeight = 0;

onMounted(() => {
  const rect = photoBox.value.getBoundingClientRect();
  boxWidth = rect.width;
  boxHeight = rect.height;
});


const soldier = ref({
  last_name: "",
  first_name: "",
  middle_name: "",
  birth_info: "",
  phone_nums: "",
  home_address: "",
  registration_address: "",
  when_called: "",
  who_called: "",
  service_type: "",
  position: "",
  military_ticket: "",
  passport: "",
  family_status: "",
  tax_id: "",
  personal_number: "",
  ubd_status: false,
  ubd_date: "",
  ubd_data: "",
  is_awards: false,
  awards: "",
  is_injuries: false,
  injuries: "",
  is_driver_license: false,
  driver_license: "",
  is_vehicle: false,
  vehicle: "",
  num_vehicle: "",
  is_criminal_records: false,
  criminal_records: "",
  is_admin_records: false,
  admin_records: "",
  is_before_service_records: false,
  before_service_records: "",
  photoFile: null,
  photoUrl: "",
  military_rank:"",
  family: [
    { relation: "", fullname: "", birth_date: "", workplace: "", address: "", phone: "" }
  ]
})

const requiredFields = [
  "last_name","first_name","middle_name","birth_info","phone_nums",
  "home_address","registration_address","when_called","who_called",
  "service_type","position","family_status","tax_id","personal_number",
  "military_ticket","passport","military_rank"
]

const isFormValid = computed(() => {
  return requiredFields.every(f => soldier.value[f] && soldier.value[f].toString().trim() !== "")
})

function onPersonalNumberInput(e) {
  let value = e.target.value.replace(/[^а-яА-ЯїЇіІєЄґҐ0-9-]/g, '');
  soldier.value.personal_number = value.toUpperCase();
}
function onInn(e) {
  let value = e.target.value.replace(/[^0-9-]/g, '');
  soldier.value.tax_id = value;
}

function addFamilyRow() {
  soldier.value.family.push({ relation: "", fullname: "", birth_date: "", workplace: "", address: "", phone: "" })
}

async function onPhotoUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const resized = await resizeImage(file, boxWidth, boxHeight);
  soldier.value.photoFile = resized.file;
  photoPreview.value = resized.dataUrl;
}

async function uploadPhoto(id) {
  if (!soldier.value.photoFile) return;

  const form = new FormData();
  form.append("photo", soldier.value.photoFile);

  const res = await fetch(`${API_URL}/api/photoUpload?id=${id}`, {
    method: "POST",
    body: form
  });

  const data = await res.json();

  if (data.success) {
    soldier.value.photoUrl = data.photoUrl;
    photoPreview.value = data.photoUrl;
  } else {
    console.error("PHOTO UPLOAD ERROR:", data.error);
  }
}


async function save() {
  triedSubmit.value = true;
  if (!isFormValid.value) return;

  isLoading.value = true;
  try {
    const res = await fetch(`${API_URL}/api/soldiers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify(soldier.value)
    });

    const json = await res.json();
    if (!json.success) {
      alert("Помилка: " + json.error);
      return;
    }

    const id = json.data.personal_id;
    await uploadPhoto(id);

    alert("Дані збережено!");
    location.reload();

  } catch (err) {
    alert("Помилка при збереженні: " + err.message);
  }
  finally {
    isLoading.value = false;
  }
}

function autoResize(e) {
  const el = e.target;
  el.style.height = "auto";
  el.style.height = el.scrollHeight + "px";
}

const loadSoldier = async () => {
  const dogTag = soldier.value.personal_number;
  if (!dogTag) return;

  isLoading.value = true;
  try {
    const res = await fetch(`${API_URL}/api/person?dog_tag=${encodeURIComponent(dogTag)}`, {
      headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
    });

    const json = await res.json();
    if (!json.success) throw new Error(json.error || "Не знайдено");

    const data = json.data.data;

    for (const key in soldier.value) {
      if (data.hasOwnProperty(key)) soldier.value[key] = data[key];
    }

    if (data.photoUrl) {
      soldier.value.photoUrl = data.photoUrl;
      photoPreview.value = data.photoUrl;
    } else {
      photoPreview.value = null;
    }

    await nextTick();
    document.querySelectorAll("textarea").forEach(el => autoResize({ target: el }));
  }
  catch (err) {
    alert("Помилка завантаження: " + err.message);
  }
  finally {
    isLoading.value = false;
  }
};

function resizeImage(file, maxWidth, maxHeight) {
  return new Promise(resolve => {
    const reader = new FileReader();

    reader.onload = event => {
      const img = new Image();

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        const scale = Math.min(maxWidth / width, maxHeight / height);

        width = width * scale;
        height = height * scale;

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(blob => {
          resolve({
            file: new File([blob], file.name, { type: file.type }),
            dataUrl: canvas.toDataURL(file.type)
          });
        }, file.type);
      };

      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  });
}

async function savePdf() {
  const original = pdfArea.value;
  if (!original) return;


  const buttons = original.querySelectorAll("button:not(.add-row), .save-btn, .upload-btn");
  buttons.forEach(b => b.classList.add("pdf-hide"));

  const clone = original.cloneNode(true);
  clone.classList.add("pdf-compact");

  clone.querySelectorAll(".field").forEach(f => {
    f.style.display = "flex";
    f.style.alignItems = "center";
    f.style.flexWrap = "nowrap";
    f.style.columnGap = "6px";
  });


  clone.querySelectorAll("input[type='checkbox']").forEach(el => {
    const box = document.createElement("span");

    box.style.display = "inline-flex";
    box.style.alignItems = "center";
    box.style.justifyContent = "center";
    box.style.width = "14px";
    box.style.height = "14px";
    box.style.border = "1px solid #000";
    box.style.marginRight = "6px";
    box.style.fontSize = "12px";
    box.style.fontWeight = "bold";

    box.textContent = el.checked ? "✓" : "";

    el.replaceWith(box);
  });

  clone
    .querySelectorAll("input:not([type='checkbox']), textarea, select")
    .forEach(el => {
      const div = document.createElement("div");

      // заповнення
      if (el.tagName === "SELECT") {
        div.textContent = el.options[el.selectedIndex]?.text || "";
      } else {
        div.textContent = el.value || "";
      }

      // стиль
      div.style.border = "1px solid #000";
      div.style.padding = "2px 2px";
      div.style.minHeight = "24px";
      div.style.fontSize = "15px";
      div.style.lineHeight = "1";
      div.style.flex = "1";
      div.style.whiteSpace = "pre-wrap";
      div.style.boxSizing = "border-box";
      div.style.minWidth = "40px";

      el.replaceWith(div);
    });

  clone.querySelectorAll(".family-table td div").forEach(el => {
  el.style.border = "none"; 
  el.style.padding = "2px 2px"; 
  });

  clone.querySelectorAll(".field").forEach(f => {
    const children = Array.from(f.children);

    children.forEach(el => {

      if (el.textContent.trim() === soldier.value.ubd_data) {
        el.style.width = "200px";
        el.style.flex = "unset";
        el.style.fontSize = "14px";
      }

      if (el.textContent.trim() === soldier.value.ubd_date) {
        el.style.width = "120px";
        el.style.flex = "unset";
        el.style.fontSize = "14px";
      }

      if (el.textContent.trim() === soldier.value.vehicle) {
        el.style.width = "200px";
        el.style.fontSize = "14px";
        el.style.flex = "unset";
      }

      if (el.textContent.trim() === soldier.value.num_vehicle) {
        el.style.width = "120px";
        el.style.flex = "unset";
        el.style.fontSize = "14px";

      }

    });
  });

  clone.style.position = "absolute";
  clone.style.top = "-9999px";
  clone.style.left = "-9999px";
  document.body.appendChild(clone);

  try {
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      logging: false
    });

    const img = canvas.toDataURL("image/png");
const pdf = new jsPDF("p", "mm", "a4");

// Поля A4
const marginX = 10;  // мм
const marginY = 12;  // мм

const pageWidth = pdf.internal.pageSize.getWidth();
const usableWidth = pageWidth - marginX * 2;

const renderedHeight = canvas.height * (usableWidth / canvas.width);

pdf.addImage(img, "PNG", marginX, marginY, usableWidth, renderedHeight);

pdf.save(`${soldier.value.last_name || "card"}.pdf`);
  }
  finally { 
    buttons.forEach(b => b.classList.remove("pdf-hide"));

    clone.remove();
  }
}


</script>

<style>

.pdf-hide {
  display: none !important;
}

.pdf-compact .field {
  margin: 7px 0 !important;
}

.card {
  padding: 20px;
  width: 900px;
  margin: auto;
  font-family: Arial, sans-serif;
  position: relative;
}

.card.disabled {
  pointer-events: none;
  opacity: 0.4;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loader {
  padding: 15px 25px;
  background: white;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  box-shadow: 0 0 10px black;
}

.top-section {
  display: flex;
}

.photo-box {
  width: 200px;
  height: 260px;
  border: 1px solid black;
  margin-right: 20px;
  text-align: center;
  position: relative;
}

.photo-box input[type="file"] {
  display: none;
}

.photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-placeholder {
  padding-top: 120px;
}

.main-info {
  flex: 1;
}

.title {
  text-align: center;
  font-size: 16px;
  margin-bottom: 10px;
}

.field {
  display: flex;
  align-items: center;
  margin: 5px 0;
}

.field.invalid select,
.field.invalid textarea,
.field.invalid input {
  border: 2px solid red;
}

.field label{
  width: 250px;
  font-weight: bold;
  text-align: left;
  font-size:13px;
}

.field input,
.field select,
.field textarea {
  flex: 1;
  font-size:15px;
}

.bottom-section {
  margin-top: 20px;
}

.family-wrapper {
  width: 100%;
  overflow-x: auto;
  font-size: 13px;
  text-align: center;
}

.family-table {
  width: 100%;
  min-width: 850px;
  border-collapse: collapse;
}

.family-table th, .family-table td {
  border: 1px solid black;
  padding: 2px;
  font-size: 13px;
  text-align: center;
  white-space: nowrap;
}

.family-table textarea {
  border: 0px;
}

.family-table input {
  width: 100%;
  border: none;
  padding: 4px;
  box-sizing: border-box;
}

.add-row, .save-btn {
  margin-top: 15px;
  padding: 8px 15px;
}
</style>
