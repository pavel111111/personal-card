<template>
  <div class="card">
       <h1 class="title">
          СОЦІАЛЬНО - ДЕМОГРАФІЧНА КАРТКА НА ВІЙСЬКОВОСЛУЖБОВЦЯ
        </h1>
    <!-- Верхній блок: Фото + Основні дані -->
    <div class="top-section">
      <div class="photo-box">
        <img v-if="photoPreview" :src="photoPreview" class="photo" />
        <div v-else class="photo-placeholder">Фото</div>

        <input type="file" @change="onPhotoUpload" />
      </div>

      <div class="main-info">
 
        <div class="field"><label>Прізвище:</label> <input v-model="soldier.last_name" /></div>
        <div class="field"><label>Ім’я:</label> <input v-model="soldier.first_name" /></div>
        <div class="field"><label>По батькові:</label> <input v-model="soldier.middle_name" /></div>
        <div class="field"><label>Дата народження:</label> <input type="date" v-model="soldier.birth_info" /></div>
        <div class="field"><label>Номер телефону:</label> <input v-model="soldier.registration_address" /></div>

      <div class="field"><label>Адреса проживання:</label> <textarea v-model="soldier.home_address" @input="autoResize($event)" rows="1" style="overflow:hidden; resize:none;" required>></textarea></div>
      <div class="field"><label>Адреса реєстрації:</label> <textarea v-model="soldier.registration_address" @input="autoResize($event)" rows="1" style="overflow:hidden; resize:none;" required></textarea></div>

      <div class="field"><label>Коли призваний:</label> <input type="date" v-model="soldier.when_called" /></div>
      <div class="field"><label>Ким призваний:</label> <input v-model="soldier.who_called" /></div>
       <div class="field"> <label>Вид служби:</label>
          <select v-model="soldier.service_type" required>
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
      <div class="field"><label>Займана посада:</label> <textarea v-model="soldier.position" @input="autoResize($event)" rows="1" style="overflow:hidden; resize:none;" required></textarea></div>
      <div class="field"><label>Серія і номер військового квитка:</label> <input v-model="soldier.military_ticket" /></div>
      <div class="field"><label>Паспорт (серія, №, ким виданий):</label> <input v-model="soldier.passport" /></div>
      <div class="field"> <label>Сімейний стан:</label>
          <select v-model="soldier.family_status" required>
            <option disabled value="">Оберіть cімейний стан</option>
            <option value="type1">Одружений/Заміжня</option>
            <option value="type2">Неодружений/Незаміжня</option>
            <option value="type3">Розлучений(на)</option>
            <option value="type4">Вдівець(ва)</option>
            <option value="type4">Цивільний шлюб</option>
          </select>
      </div>
      <div class="field"><label>Ідентифікаційний код:</label> <input v-model="soldier.tax_id" /></div>
      <div class="field"><label>Особовий номер (жетон):</label> <input v-model="soldier.personal_number" /></div>
      <div class="field"><label><input type="checkbox" v-model="soldier.ubd_status"/> Наявність УБД: </label>
        <label>Cерія, №, ким виданий:</label> <input v-model="soldier.ubd_data" :disabled="!soldier.ubd_status" />
        <label style="text-align:right">Дата видачі УБД:</label> <input type="date" v-model="soldier.ubd_date" :disabled="!soldier.ubd_status" />
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

      <table class="family-table">
        <thead>
          <tr>
            <th>Ступінь спорідненості</th>
            <th>П.І.Б</th>
            <th>Дата народження</th>
            <th>Місце роботи</th>
            <th>Домашня адреса</th>
            <th>Номер телефону</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(member, i) in soldier.family" :key="i">
            <td><input v-model="member.relation" /></td>
            <td><input v-model="member.fullname" /></td>
            <td><input v-model="member.birth_date" /></td>
            <td><input v-model="member.workplace" /></td>
            <td><input v-model="member.address" /></td>
            <td><input v-model="member.phone" /></td>
          </tr>
        </tbody>
      </table>

      <button class="add-row" @click="addFamilyRow">+ Додати рядок</button>

    </div>

    <button class="save-btn" @click="save">Зберегти</button>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const photoPreview = ref(null)

const soldier = ref({
  last_name: "",
  first_name: "",
  middle_name: "",
  birth_info: "",
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
  ubd_status: "",
  ubd_date: "",
  awards: "",
  injuries: "",
  driver_license: "",
  vehicle: "",
  criminal_records: "",
  admin_records: "",
  before_service_records: "",
  family: [
    { relation: "", fullname: "", birth_date: "", workplace: "", address: "", phone: "" }
  ]
})

function addFamilyRow() {
  soldier.value.family.push({ relation: "", fullname: "", birth_date: "", workplace: "", address: "", phone: "" })
}

function onPhotoUpload(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = e => photoPreview.value = e.target.result
    reader.readAsDataURL(file)
  }
}

function save() {
  console.log("Saving:", soldier.value)
  alert("Дані збережено")
}
function autoResize(event) {
  const el = event.target
  el.style.height = 'auto'
  el.style.height = el.scrollHeight + 'px'
}
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

.family-title {
  text-align: center;
  margin-top: 20px;
}

.family-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.family-table th, .family-table td {
  border: 1px solid black;
  padding: 5px;
}

.add-row, .save-btn {
  margin-top: 15px;
  padding: 8px 15px;
}
</style>
