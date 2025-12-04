<template>
  <div class="card">
       <h1 class="title">
          <button class="add-row" @click="loadSoldier">СОЦІАЛЬНО - ДЕМОГРАФІЧНА КАРТКА НА ВІЙСЬКОВОСЛУЖБОВЦЯ</button>
        </h1>
    <!-- Верхній блок: Фото + Основні дані -->
    <div class="top-section">
      
<div class="photo-box">
  <img v-if="photoPreview" :src="photoPreview" class="photo" />
  <div v-else class="photo-placeholder">Фото</div>

  <label class="upload-btn">
    Завантажити
    <input type="file" @change="onPhotoUpload" />
  </label>
</div>

      <div class="main-info">
 
        <div class="field" :class="{ invalid: !soldier.last_name && triedSubmit }"><label>Прізвище:</label> <input v-model="soldier.last_name" /></div>
        <div class="field" :class="{ invalid: !soldier.first_name && triedSubmit }"><label>Ім’я:</label> <input v-model="soldier.first_name" /></div>
        <div class="field" :class="{ invalid: !soldier.middle_name && triedSubmit }"><label>По батькові:</label> <input v-model="soldier.middle_name" /></div>
        <div class="field" :class="{ invalid: !soldier.birth_info && triedSubmit }"><label>Дата народження:</label> <input type="date" v-model="soldier.birth_info" /></div>
        <div class="field" :class="{ invalid: !soldier.phone_nums && triedSubmit }"><label>Номер телефону:</label> <input v-model="soldier.phone_nums" /></div>

      <div class="field" :class="{ invalid: !soldier.home_address && triedSubmit}"><label>Адреса проживання:</label><textarea v-model="soldier.home_address" @input="autoResize($event)" rows="1" style="overflow:hidden; resize:none;"></textarea></div>
      <div class="field" :class="{ invalid: !soldier.registration_address && triedSubmit }"><label>Адреса реєстрації:</label><textarea v-model="soldier.registration_address" @input="autoResize($event)" rows="1" style="overflow:hidden; resize:none;"></textarea></div>

      <div class="field" :class="{invalid: !soldier.when_called && triedSubmit}"><label>Коли призваний:</label> <input type="date" v-model="soldier.when_called" /></div>
      <div class="field" :class="{invalid: !soldier.who_called && triedSubmit}"><label>Ким призваний:</label> <input v-model="soldier.who_called" /></div>
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

    <!-- Нижній блок полів -->
    <div class="bottom-section">
    <div class="field" style="text-align:left">Я,____________________________________, надаю згоду для опрацювання своїх персональних даних офіцерам НГУ на період проходження служби. _____________ (підпис)</div>
      <div class="field" :class="{ invalid: !soldier.position && triedSubmit }"><label>Займана посада:</label> <textarea v-model="soldier.position" @input="autoResize($event)" rows="1" style="overflow:hidden; resize:none;" required></textarea></div>
      <div class="field" :class="{ invalid: !soldier.military_ticket && triedSubmit }"><label>Серія і номер військового квитка:</label> <input v-model="soldier.military_ticket" /></div>
      <div class="field" :class="{ invalid: !soldier.passport && triedSubmit }"><label>Паспорт (серія, №, ким виданий):</label> <input v-model="soldier.passport" /></div>
      <div class="field" :class="{ invalid: !soldier.family_status && triedSubmit }"> <label>Сімейний стан:</label>
          <select v-model="soldier.family_status" required>
            <option disabled value="">Оберіть cімейний стан</option>
            <option value="type1">Одружений/Заміжня</option>
            <option value="type2">Неодружений/Незаміжня</option>
            <option value="type3">Розлучений(на)</option>
            <option value="type4">Вдівець/Вдова</option>
            <option value="type4">Цивільний шлюб</option>
          </select>
      </div>
      <div class="field" :class="{ invalid: !soldier.tax_id && triedSubmit }"><label>Ідентифікаційний код:</label> <input v-model="soldier.tax_id" /></div>
      <div class="field" :class="{ invalid: !soldier.personal_number && triedSubmit }">
        <label>Особовий номер (жетон):</label> 
        <input v-model="soldier.personal_number" @input="onPersonalNumberInput" />
      </div>


     <div class="field" :class="{ invalid: soldier.ubd_status && triedSubmit && (!soldier.ubd_data || !soldier.ubd_date)}">
      <label> <input type="checkbox" v-model="soldier.ubd_status" />  Наявність УБД: </label>

      <label>Серія, №, ким виданий:</label>
      <input v-model="soldier.ubd_data" :disabled="!soldier.ubd_status" />
      <label style="text-align:right">Дата видачі УБД:</label>
      <input type="date" v-model="soldier.ubd_date" :disabled="!soldier.ubd_status" />
     </div>


      <div class="field"><label><input type="checkbox" v-model="soldier.is_awards"/>Державні нагороди:</label> 
                                 <input v-model="soldier.awards" :disabled="!soldier.is_awards" />
      </div>
      <div class="field"><label><input type="checkbox" v-model="soldier.is_injuries"/>Отримані поранення:</label> 
                                 <input v-model="soldier.injuries" :disabled="!soldier.is_injuries" />
      </div>
      <div class="field"><label><input type="checkbox" v-model="soldier.is_driver_license"/>Водійське посвідчення:</label> 
                                 <input v-model="soldier.driver_license" :disabled="!soldier.is_driver_license" />
      </div>
      <div class="field"><label><input type="checkbox" v-model="soldier.is_vehicle"/>Наявність особист. ТЗ:</label> 
                         <label style="text-align:right">Марка:</label><input v-model="soldier.vehicle" :disabled="!soldier.is_vehicle" />
                         <label style="text-align:right">Номерний знак:</label><input v-model="soldier.num_vehicle" :disabled="!soldier.is_vehicle" />
     </div>
      <div class="field"><label><input type="checkbox" v-model="soldier.is_criminal_records"/>Кримінальні правопорушення:</label> 
                                 <input v-model="soldier.criminal_records" :disabled="!soldier.is_criminal_records" />
      </div>
      <div class="field"><label><input type="checkbox" v-model="soldier.is_admin_records"/>Адміністративні правопорушення:</label> 
                                 <input v-model="soldier.admin_records" :disabled="!soldier.is_admin_records" />
      </div>
      <div class="field"><label><input type="checkbox" v-model="soldier.is_before_service_records"/>Правопорушення до служби:</label> 
                                 <input v-model="soldier.before_service_records" :disabled="!soldier.is_before_service_records" />
      </div>      

      <h3 class="family-title">Склад сім’ї:</h3>

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

        <td>
          <input
            style="width:70px"
            v-model="member.relation"
            :class="{ invalid: triedSubmit && !member.relation }"
          >
        </td>

        <td>
          <textarea
            v-model="member.fullname"
            @input="autoResize($event)"
            rows="1"
            style="overflow:hidden; resize:none; width:180px"
            :class="{ invalid: triedSubmit && !member.fullname }"
          ></textarea>
        </td>

        <td>
          <input
            type="date"
            v-model="member.birth_date"
            :class="{ invalid: triedSubmit && !member.birth_date }"
          >
        </td>

        <td>
          <textarea
            v-model="member.workplace"
            @input="autoResize($event)"
            rows="1"
            style="overflow:hidden; resize:none; width:100px"
            :class="{ invalid: triedSubmit && !member.workplace }"
          ></textarea>
        </td>

        <td>
          <textarea
            v-model="member.address"
            @input="autoResize($event)"
            rows="1"
            style="overflow:hidden; resize:none; width:240px"
            :class="{ invalid: triedSubmit && !member.address }"
          ></textarea>
        </td>

        <td>
          <textarea
            v-model="member.phone"
            @input="autoResize($event)"
            rows="1"
            style="overflow:hidden; resize:none; width:110px"
            :class="{ invalid: triedSubmit && !member.phone }"
          ></textarea>
        </td>

      </tr>
    </tbody>
  </table>
</div>

      <button class="add-row" @click="addFamilyRow">+ Додати рядок</button>

    </div>

    <button class="save-btn" @click="save">Зберегти</button>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
const triedSubmit = ref(false)

const photoPreview = ref(null)

const isFormValid = computed(() => {
  if (soldier.value.ubd_status) {
    requiredFields.push("ubd_data", "ubd_date");
  }
  return requiredFields.every(field => soldier.value[field] && soldier.value[field].toString().trim() !== "")
})

function onPersonalNumberInput(event) {
  let value = event.target.value.replace(/[^а-яА-ЯёЁїЇіІєЄґҐ0-9-]/g, '');  
  value = value.toUpperCase();
  soldier.value.personal_number = value;
}
const requiredFields = [
  "last_name",
  "first_name",
  "middle_name",
  "phone_nums",
  "birth_info",
  "home_address",
  "registration_address",
  "when_called",
  "who_called",
  "service_type",
  "position",
  "family_status",
  "tax_id",
  "personal_number",
  "military_ticket",
  "passport"
]

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
  consent_name: "",

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
  photo: "",
  family: [
    {
      relation: "",
      fullname: "",
      birth_date: "",
      workplace: "",
      address: "",
      phone: ""
    }
  ]
})

function addFamilyRow() {
  soldier.value.family.push({ relation: "", fullname: "", birth_date: "", workplace: "", address: "", phone: "" })
}

function onPhotoUpload(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = e => {
      photoPreview.value = e.target.result
      soldier.value.photo = e.target.result  // зберігаємо Base64 у soldier
    }
    reader.readAsDataURL(file)
  }
}

async function save() {
  triedSubmit.value = true
  if (!isFormValid.value) return
  try {

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/soldiers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify(soldier.value),
    });

    const result = await response.json();

    if (result.success) {
      alert("Дані збережено успішно!");
      location.reload();
    } else {
      alert("Помилка збереження: " + result.error);
    }
  } catch (err) {
    //console.error("Fetch error:", err);
    alert("Помилка під час збереження даних: " + err.message);
  }
}

function autoResize(event) {
  const el = event.target
  el.style.height = 'auto'
  el.style.height = el.scrollHeight + 'px'
}

import { nextTick } from 'vue'

const loadSoldier = async () => {
  const dogTag = soldier.value.personal_number;

  if (!dogTag) {
    return;
  }

  try {
     const response = await fetch(`${import.meta.env.VITE_API_URL}/api/person?dog_tag=${encodeURIComponent(dogTag)}`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    });

    if (response.status === 401) throw new Error("401 Unauthorized – токен недійсний або закінчився");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
  if (!data || !data.data) {
    throw new Error("Відсутні дані по жетону");
  }
    // Заповнюємо всі поля
    for (const key in soldier.value) {
      if (data.data.data.hasOwnProperty(key)) {
        soldier.value[key] = data.data.data[key];
      }
    }

    
    // Якщо фото є, формуємо data URL для <img>
    if (soldier.value.photo) {
        const cleanedBase64 = soldier.value.photo.replace(/\s+/g, '');
      //photoPreview.value = `data:${soldier.value.photo_mime};base64,${cleanedBase64}`;
      photoPreview.value = `data:image/jpeg;base64,${soldier.value.photo}`;
    } else {
      photoPreview.value = null;
    }
    // Даємо Vue оновити DOM
    await nextTick();

    // Запускаємо autoresize для всіх textarea
    document.querySelectorAll("textarea").forEach(el => autoResize({ target: el }));

  } catch (err) {
    console.error("Помилка завантаження:", err);
    alert(err);
  }
};

</script>

<style>
.card {
  padding: 20px;
  width: 900px;
  margin: auto;
  font-family: Arial, sans-serif;
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
  align-items: center;   /* вертикальне вирівнювання */
  margin: 5px 0;
}

.field.invalid select {
  border: 2px solid red;
}

.field.invalid textarea {
  border: 2px solid red;
}

.field.invalid input {
  border: 2px solid red;
}

.field label{
  width: 250px;          /* однакова ширина */
  font-weight: bold;
  text-align: left;      /* вирівнювання тексту */
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
  overflow-x: auto;     /* Горизонтальна прокрутка при потребі */
  margin-top: 0px;
  border: 0px solid #ccc;
  border-radius: 0px;
  font-size: 13px;
  text-align: center;
}

.family-table {
  width: 100%;
  min-width: 850px;      /* Щоб таблиця мала мінімальну ширину */
  border-collapse: collapse;
}

.family-table th, .family-table td {
  border: 1px solid black;
  padding: 2px;
  font-size: 13px;
  text-align: center;
  white-space: nowrap;   /* Текст не переноситься — зручніше */
}
.family-table textarea{
  border: 0px;
}

.family-table input {
  width: 100%;
  border: none;
  padding: 4px;
  box-sizing: border-box;  
}

.family-table .invalid {
  border: 2px solid red !important;
}
.add-row, .save-btn {
  margin-top: 15px;
  padding: 8px 15px;
}
</style>
