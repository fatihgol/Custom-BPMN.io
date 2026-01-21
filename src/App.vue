<template>
  <div class="app-shell">
    <div class="toolbar">
      <h1>BPMN Editör</h1>
      <button @click="resetDiagram">Yeni Diyagram</button>
      <button @click="downloadDiagram">XML İndir</button>
      <label>
        XML Yükle
        <input type="file" accept=".bpmn,.xml" hidden @change="uploadDiagram" />
      </label>
    </div>

    <div class="canvas-wrapper">
      <div class="modern-bpmn-palette">
        <div class="palette-header">
          <span class="dots"></span>
        </div>

        <button
          class="palette-entry start-event"
          title="Başlangıç"
          @mousedown.prevent="(e) => startPaletteAction('start', e)"
        >
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" stroke-width="2" fill="none" />
            <path d="M10 8l6 4-6 4V8z" stroke="none" />
          </svg>
        </button>

        <div class="palette-separator"></div>

        <button
          class="palette-entry user-task"
          title="Kullanıcı Görevi"
          @mousedown.prevent="(e) => startPaletteAction('userTask', e)"
        >
          <svg viewBox="0 0 24 24">
            <g transform="translate(2, 1)">
              <circle cx="10" cy="7" r="6" stroke="none" />
              <path
                d="M 2,19 C 2,14 5,14 10,14 C 15,14 18,14 18,19"
                stroke-width="3"
                fill="none"
                stroke-linecap="round"
              />
            </g>
          </svg>
        </button>

        <button
          class="palette-entry group-task"
          title="Grup Görevi"
          @mousedown.prevent="(e) => startPaletteAction('userGroupTask', e)"
        >
          <svg viewBox="0 0 24 24">
            <g transform="translate(1, 1)">
              <circle cx="15" cy="7" r="5" stroke="none" class="secondary-shape" />
              <path
                d="M 9,18 C 9,14 12,14 15,14 C 18,14 21,14 21,18"
                stroke-width="3"
                fill="none"
                stroke-linecap="round"
                class="secondary-shape"
              />
              <circle cx="8" cy="9" r="6" stroke="none" />
              <path d="M 0,21 C 0,16 3,16 8,16 C 13,16 16,16 16,21" stroke-width="3" fill="none" stroke-linecap="round" />
            </g>
          </svg>
        </button>

        <button
          class="palette-entry service-task"
          title="Servis Görevi"
          @mousedown.prevent="(e) => startPaletteAction('serviceTask', e)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 2V5 M12 19V22 M2 12H5 M19 12H22 M4.9 4.9L7 7 M17 17L19.1 19.1 M4.9 19.1L7 17 M17 7L19.1 4.9" />
          </svg>
        </button>

        <button
          class="palette-entry api-call"
          title="API Çağrısı"
          @mousedown.prevent="(e) => startPaletteAction('apiCallTask', e)"
        >
          <svg viewBox="0 0 24 24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <g transform="translate(0, 1)">
              <path d="M 2,8 L 18,8 M 14,4 L 18,8 L 14,12" fill="none" />
              <path d="M 22,16 L 6,16 M 10,20 L 6,16 L 10,12" fill="none" />
            </g>
          </svg>
        </button>

        <button
          class="palette-entry notification"
          title="Bildirim"
          @mousedown.prevent="(e) => startPaletteAction('notificationNode', e)"
        >
          <svg viewBox="0 0 24 24">
            <path d="M12 3A6 6 0 0 0 6 9v7l-3 3h18l-3-3V9a6 6 0 0 0-6-6z" stroke="none" />
            <path d="M9 21h6a3 3 0 0 1-6 0z" stroke="none" />
          </svg>
        </button>

        <button
          class="palette-entry generate-doc"
          title="Şablondan Belge Üret"
          @mousedown.prevent="(e) => startPaletteAction('generateDocTask', e)"
        >
          <svg viewBox="0 0 24 24">
            <g transform="translate(2, 1)">
              <path d="M3 1h9l5 5v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              <path d="M12 1v5h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
              
              <rect x="6" y="11" width="8" height="6" rx="1" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="1.5"/>

              <path d="M 0,14 H 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M 3,12 L 5,14 L 3,16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
          </svg>
        </button>

        <button
          class="palette-entry decision"
          title="Karar Tablosu"
          @mousedown.prevent="(e) => startPaletteAction('decisionNode', e)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke-width="2">
            <g transform="translate(1, 2)">
              <rect x="0" y="0" width="22" height="20" rx="2" />
              <line x1="0" y1="6" x2="22" y2="6" stroke-width="1.5" />
              <line x1="0" y1="13" x2="22" y2="13" stroke-width="1" />
              <line x1="8" y1="0" x2="8" y2="20" stroke-width="1.5" />
              <circle cx="4" cy="10" r="1.5" stroke="none" />
              <circle cx="15" cy="10" r="1.5" stroke="none" />
              <circle cx="4" cy="17" r="1.5" stroke="none" />
            </g>
            </g>
          </svg>
        </button>

        <button
          class="palette-entry call-activity"
          title="Alt Akış Çağır"
          @mousedown.prevent="(e) => startPaletteAction('callActivity', e)"
        >
          <svg viewBox="0 0 24 24">
            <g transform="translate(2, 2)">
              <rect x="1" y="2" width="18" height="16" rx="3" fill="none" stroke="currentColor" stroke-width="2"/>
              <path d="M 10,6 V 14 M 6,10 H 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <circle cx="1" cy="10" r="1" fill="currentColor" stroke="none"/>
              <circle cx="19" cy="10" r="1" fill="currentColor" stroke="none"/>
            </g>
          </svg>
        </button>

        <div class="palette-separator"></div>

        <button
          class="palette-entry end-event"
          title="Bitiş"
          @mousedown.prevent="(e) => startPaletteAction('end', e)"
        >
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" stroke-width="2.5" fill="none" />
            <rect x="9" y="9" width="6" height="6" rx="1" stroke="none" />
          </svg>
        </button>
      </div>

      <div ref="bpmnContainer" class="canvas"></div>
      <div class="zoom-controls">
        <button @click="zoomOut">−</button>
        <button @click="resetZoom">•</button>
        <button @click="zoomIn">＋</button>
      </div>
    </div>

    <div v-if="showModal" class="modal-backdrop" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <strong>{{ modalTitle }}</strong>
          <button class="close-btn" @click="closeModal">✕</button>
        </div>
        <div class="modal-body">
          <label class="field">
            <span>Başlık</span>
            <input v-model="formState.name" type="text" />
          </label>
          <div class="attr-list">
            <strong>Bu tip için attributeler:</strong>
            <div class="chips">
              <span class="chip" v-for="attr in attributeList" :key="attr">{{ attr }}</span>
            </div>
          </div>
          <div v-for="field in currentFields" :key="field.key" class="field">
            <span>{{ field.label }}</span>
            <template v-if="field.type === 'textarea'">
              <textarea v-model="formState.fields[field.key]" rows="3"></textarea>
            </template>
            <template v-else-if="field.type === 'checkbox'">
              <input type="checkbox" v-model="formState.fields[field.key]" />
            </template>
            <template v-else-if="field.type === 'select'">
              <select v-model="formState.fields[field.key]">
                <option v-for="opt in field.options" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
            </template>
            <template v-else-if="field.type === 'key-value-table'">
              <div class="events-table-wrapper">
                <table class="events-table">
                  <thead>
                    <tr>
                      <th>Key</th>
                      <th>Value</th>
                      <th style="width: 40px;"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, idx) in formState.fields[field.key]" :key="idx">
                      <td><input type="text" v-model="item.key" placeholder="Content-Type" /></td>
                      <td><input type="text" v-model="item.value" placeholder="application/json" /></td>
                      <td><button class="icon-btn delete" @click="removeEvent(field.key, idx)">🗑️</button></td>
                    </tr>
                  </tbody>
                </table>
                <button type="button" class="secondary small" @click="addKeyValue(field.key)">+ Add Header</button>
              </div>
            </template>
            <template v-else-if="field.type === 'decision-table'">
              <div class="events-table-wrapper">
                <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">
                  * Kuralları sırayla tanımlayın (If, Else If...). Her zaman bir <strong>Default (Else)</strong> kolu otomatik oluşturulur.
                  <span v-if="formState.taskKey === 'apiCallTask'" style="display:block; margin-top:2px; color:#0284c7;">
                    Örn: <code>response.status == 200</code> veya <code>response.body.success === true</code>
                  </span>
                </div>
                <table class="events-table">
                  <thead>
                    <tr>
                      <th>Label</th>
                      <th>Condition</th>
                      <th style="width: 40px;"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(rule, idx) in formState.fields[field.key]" :key="idx">
                      <td><input type="text" v-model="rule.label" placeholder="Örn: Başarılı (200)" /></td>
                      <td><input type="text" v-model="rule.condition" placeholder="Condition" style="font-family: monospace;" /></td>
                      <td><button class="icon-btn delete" @click="removeEvent(field.key, idx)">🗑️</button></td>
                    </tr>
                  </tbody>
                </table>
                <button type="button" class="secondary small" @click="addDecisionRule(field.key)">+ Kural Ekle</button>
              </div>
            </template>
            <template v-else>
              <input :type="field.type" v-model="formState.fields[field.key]" />
            </template>
          </div>
        </div>
        <div class="modal-footer">
          <button class="secondary" @click="closeModal">İptal</button>
          <button class="primary" @click="saveModal">Kaydet</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, computed, toRaw } from 'vue';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import CustomPalette from './bpmn/CustomPalette';
import CustomRenderer from './bpmn/CustomRenderer';
import customWorkflowModule from './bpmn/custom';
import { taskTypes } from './bpmn/taskTypes';

const bpmnContainer = ref(null);
const modeler = ref(null);
const services = ref(null);
const showModal = ref(false);
const modalElement = ref(null);
const modalElementId = ref(null);
const formState = ref({ name: '', fields: {}, taskKey: '' });

const modalTitle = computed(() => {
  const task = taskTypes.find((t) => t.key === formState.value.taskKey);
  return task ? `${task.label} Özellikleri` : 'Özellikler';
});

const currentFields = computed(() => fieldDefs[formState.value.taskKey] || []);
const attributeList = computed(() => currentFields.value.map((f) => `data-${f.key}`));

const ELEMENT_MAPPING = {
  'bpmn:StartEvent': { 'data-task-type': 'start' },
  'bpmn:UserTask': { 'data-task-type': ['userTask', 'userGroupTask'] },
  'bpmn:Task': { 'data-task-type': 'userTask' },
  'bpmn:Task': { 'data-task-type': 'userTask' },
  'bpmn:Task': { 'data-task-type': 'userTask' },
  'bpmn:ServiceTask': { 'data-task-type': ['serviceTask', 'apiCallTask', 'generateDocTask', 'callActivity'] },
  'bpmn:ExclusiveGateway': { 'data-task-type': 'decisionNode' },
  'bpmn:ExclusiveGateway': { 'data-task-type': 'decisionNode' },
  'bpmn:ExclusiveGateway': { 'data-task-type': 'decisionNode' },
  'bpmn:SendTask': { 'data-task-type': 'notificationNode' },
  'bpmn:EndEvent': { 'data-task-type': 'end' }
};

const baseFields = [
  { key: 'description', label: 'Açıklama', type: 'textarea' },
  { key: 'metadata-icon', label: 'Icon', type: 'text' },
  { key: 'metadata-color', label: 'Renk', type: 'text' },
  { key: 'metadata-category', label: 'Kategori', type: 'text' }
];

const fieldDefs = {
  start: [...baseFields],
  end: [...baseFields, { key: 'end-type', label: 'End Tipi', type: 'text' }],
  userTask: [
    { key: 'assignment-type', label: 'Atama Tipi', type: 'text' },
    { key: 'assignment-value', label: 'Atama Değeri', type: 'text' },
    { key: 'form-key', label: 'Form Key', type: 'text' },
    { key: 'priority', label: 'Öncelik', type: 'text' },
    { key: 'customOutputEvents', label: 'Events', type: 'events-table' },
    { key: 'timeout-enabled', label: 'Timeout Aktif', type: 'checkbox' },
    { key: 'timeout-duration', label: 'Timeout Süresi (ISO 8601)', type: 'text' },
    { 
      key: 'timeout-action', 
      label: 'Timeout Aksiyonu', 
      type: 'select',
      options: [
        { value: 'reminder', label: 'Hatırlatma' },
        { value: 'event', label: 'Event Çağırma' }
      ]
    },
    ...baseFields
  ],
  userGroupTask: [
    { key: 'assignment-type', label: 'Atama Tipi', type: 'text' },
    { key: 'assignment-value', label: 'Atama Değeri', type: 'text' },
    { key: 'completion-strategy', label: 'Tamamlama Stratejisi', type: 'text' },
    { key: 'form-key', label: 'Form Key', type: 'text' },
    { key: 'priority', label: 'Öncelik', type: 'text' },
    { key: 'customOutputEvents', label: 'Events', type: 'events-table' },
    { key: 'timeout-enabled', label: 'Timeout Aktif', type: 'checkbox' },
    { key: 'timeout-duration', label: 'Timeout Süresi (ISO 8601)', type: 'text' },
    { 
      key: 'timeout-action', 
      label: 'Timeout Aksiyonu', 
      type: 'select',
      options: [
        { value: 'reminder', label: 'Hatırlatma' },
        { value: 'event', label: 'Event Çağırma' }
      ]
    },
    ...baseFields
  ],
  serviceTask: [
    { key: 'service-type', label: 'Servis Tipi', type: 'text' },
    { key: 'service-name', label: 'Servis Adı', type: 'text' },
    { key: 'service-method', label: 'Metot', type: 'text' },
    { key: 'service-params', label: 'Parametreler', type: 'textarea' },
    { key: 'service-result-variable', label: 'Result Variable', type: 'text' },
    { key: 'timeout-enabled', label: 'Timeout Aktif', type: 'checkbox' },
    { key: 'timeout-duration', label: 'Timeout Süresi (ISO 8601)', type: 'text' },
    { key: 'timeout-action', label: 'Timeout Aksiyonu', type: 'text' },
    { key: 'timeout-output-way', label: 'Timeout Output Way', type: 'text' },
    { key: 'retry-enabled', label: 'Retry Aktif', type: 'checkbox' },
    { key: 'retry-max-attempts', label: 'Retry Maks Deneme', type: 'text' },
    { key: 'retry-backoff-type', label: 'Backoff Tipi', type: 'text' },
    ...baseFields
  ],
  apiCallTask: [
    { 
      key: 'api-method', 
      label: 'HTTP Method', 
      type: 'select',
      options: [
        { value: 'GET', label: 'GET' },
        { value: 'POST', label: 'POST' },
        { value: 'PUT', label: 'PUT' },
        { value: 'DELETE', label: 'DELETE' },
        { value: 'PATCH', label: 'PATCH' }
      ]
    },
    { key: 'api-url', label: 'API URL', type: 'text' },
    { key: 'api-headers', label: 'Headers', type: 'key-value-table' },
    { key: 'api-body', label: 'Body', type: 'textarea' },
    { key: 'api-rules', label: 'Routing Rules (Response Evaluation)', type: 'decision-table' },
    { key: 'timeout-enabled', label: 'Timeout Aktif', type: 'checkbox' },
    { key: 'timeout-duration', label: 'Timeout Süresi (ISO 8601)', type: 'text' },
    { key: 'timeout-action', label: 'Timeout Aksiyonu', type: 'text' },
    { key: 'retry-enabled', label: 'Retry Aktif', type: 'checkbox' },
    { key: 'retry-max-attempts', label: 'Retry Maks Deneme', type: 'text' },
    { key: 'retry-backoff-type', label: 'Backoff Tipi', type: 'text' },
    { key: 'retry-max-attempts', label: 'Retry Maks Deneme', type: 'text' },
    { key: 'retry-backoff-type', label: 'Backoff Tipi', type: 'text' },
    ...baseFields
  ],
  generateDocTask: [
    { key: 'doc-template-id', label: 'Şablon ID', type: 'text' },
    { key: 'doc-output-name', label: 'Çıktı Dosya Adı', type: 'text' },
    { 
      key: 'doc-format', 
      label: 'Format', 
      type: 'select',
      options: [
        { value: 'pdf', label: 'PDF' },
        { value: 'docx', label: 'Word (DOCX)' },
        { value: 'html', label: 'HTML' }
      ]
    },
    { key: 'doc-data-source', label: 'Veri Kaynağı (JSON/Var)', type: 'textarea' },
    { key: 'doc-data-source', label: 'Veri Kaynağı (JSON/Var)', type: 'textarea' },
    ...baseFields
  ],
  callActivity: [
    { key: 'subprocess-id', label: 'Alt Akış (Sub-process) ID', type: 'text' },
    { key: 'subprocess-version', label: 'Versiyon (Opsiyonel)', type: 'text' },
    { key: 'input-mapping', label: 'Girdi Haritalama (Input Mapping)', type: 'key-value-table' },
    { key: 'output-mapping', label: 'Çıktı Haritalama (Output Mapping)', type: 'key-value-table' },
    ...baseFields
  ],
  decisionNode: [
    { key: 'decision-rules', label: 'Kurallar (If / Else If)', type: 'decision-table' },
    ...baseFields
  ],
  notificationNode: [
    { key: 'decision-rules', label: 'Kurallar (If / Else If)', type: 'decision-table' },
    ...baseFields
  ],
  notificationNode: [
    { key: 'notification-channels', label: 'Kanallar', type: 'text' },
    { key: 'notification-recipients-type', label: 'Alıcı Tipi', type: 'text' },
    { key: 'notification-recipients-value', label: 'Alıcı Değeri', type: 'text' },
    { key: 'notification-template', label: 'Template', type: 'text' },
    { key: 'notification-variables', label: 'Template Variables', type: 'textarea' },
    { key: 'notification-priority', label: 'Öncelik', type: 'text' },
    { key: 'notification-continue-on-error', label: 'Hata olsa da devam', type: 'checkbox' },
    ...baseFields
  ]
};

const initialXml = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1" name="Start" data-task-type="start">
      <bpmn:outgoing>Flow_1</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:endEvent id="EndEvent_1" name="End" data-task-type="end">
      <bpmn:incoming>Flow_1</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="EndEvent_1" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="179" y="159" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="184" y="202" width="26" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_1di" bpmnElement="EndEvent_1">
        <dc:Bounds x="305" y="159" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="313" y="202" width="20" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_1_di" bpmnElement="Flow_1">
        <di:waypoint x="215" y="177" />
        <di:waypoint x="305" y="177" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

const resetDiagram = async () => {
  if (!modeler.value) return;
  await modeler.value.importXML(initialXml);
  applyTaskTypeDefaults();
  refreshGraphics();
};

const downloadDiagram = async () => {
  if (!modeler.value) return;
  const { xml } = await modeler.value.saveXML({ format: true });
  const blob = new Blob([xml], { type: 'text/xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'diagram.bpmn';
  a.click();
  URL.revokeObjectURL(url);
};

const uploadDiagram = async (event) => {
  const file = event.target.files?.[0];
  if (!file || !modeler.value) return;
  const text = await file.text();
  await modeler.value.importXML(text);
  applyTaskTypeDefaults();
  refreshGraphics();
  event.target.value = '';
};

const applyTaskTypeDefaults = () => {
  if (!modeler.value) return;
  const elementRegistry = modeler.value.get('elementRegistry');
  const modeling = modeler.value.get('modeling');

  elementRegistry.getAll().forEach((el) => {
    if (el.type === 'label') return;

    const bo = el.businessObject;
    const existing = (bo.get && bo.get('data-task-type')) || bo.$attrs?.['data-task-type'];
    if (existing) return;

    const map = {
      'bpmn:StartEvent': 'start',
      'bpmn:EndEvent': 'end',
      'bpmn:UserTask': 'userTask',
      'bpmn:Task': 'userTask',
      'bpmn:ServiceTask': 'serviceTask',
      'bpmn:ExclusiveGateway': 'decisionNode',
      'bpmn:SendTask': 'notificationNode'
    };

    let taskKey = map[el.type];
    if (!taskKey && el.type === 'bpmn:Task') taskKey = 'userTask';
    if (taskKey) {
      modeling.updateProperties(el, {
        'data-task-type': taskKey,
        name: bo.name || taskTypes.find((t) => t.key === taskKey)?.label || ''
      });
    }
  });
};

const refreshGraphics = () => {
  if (!modeler.value) return;
  const elementRegistry = modeler.value.get('elementRegistry');
  const graphicsFactory = modeler.value.get('graphicsFactory');
  const canvas = modeler.value.get('canvas');
  elementRegistry.getAll().forEach((el) => {
    if (el.type === 'label') return;
    if (!isFinite(el.x) || !isFinite(el.y)) return;
    const gfx = canvas.getGraphics(el);
    if (gfx) {
      graphicsFactory.update('shape', el, gfx);
    }
  });
};

onMounted(async () => {
  modeler.value = new BpmnModeler({
    container: bpmnContainer.value,
    keyboard: { bindTo: window },
    bpmnRenderer: { defaultFillColor: '#fff', defaultStrokeColor: '#000' },
    additionalModules: [
      {
        paletteProvider: ['value', null],
        replaceMenuProvider: ['value', null]
      },
      {
        __init__: ['customPalette'],
        customPalette: ['type', CustomPalette]
      },
      {
        __init__: ['customRenderer'],
        customRenderer: ['type', CustomRenderer]
      },
      customWorkflowModule
    ]
  });

  await modeler.value.importXML(initialXml);
  applyTaskTypeDefaults();
  refreshGraphics();

  const canvas = modeler.value.get('canvas');
  canvas.zoom('fit-viewport');

  const zoomScroll = modeler.value.get('zoomScroll');
  zoomScroll?.reset();

  // Enable hand tool / move via space + drag; explicit activateSelection kaldırıldı

  services.value = {
    create: modeler.value.get('create'),
    elementFactory: modeler.value.get('elementFactory'),
    bpmnFactory: modeler.value.get('bpmnFactory')
  };

  const eventBus = modeler.value.get('eventBus');
  const modeling = modeler.value.get('modeling');

  eventBus.on('shape.added', ({ element }) => {
    if (element.type === 'label') return;
    const map = ELEMENT_MAPPING[element.type];
    const bo = element.businessObject;
    const existing = (bo.get && bo.get('data-task-type')) || bo.$attrs?.['data-task-type'];
    if (!map || existing) return;
    const def = map['data-task-type'];
    const taskType = Array.isArray(def) ? def[0] : def;
    if (taskType) {
      modeling.updateProperties(element, { 'data-task-type': taskType });
    }
  });

  eventBus.on('element.dblclick', (e) => {
    if (e.element.type === 'label') return;
    openModal(e.element);
  });
});

onBeforeUnmount(() => {
  modeler.value?.destroy();
});

const startPaletteAction = (taskKey, event) => {
  if (!services.value) return;
  const task = taskTypes.find((t) => t.key === taskKey);
  if (!task) return;

  const businessObject = services.value.bpmnFactory.create(task.type);
  businessObject.set('data-task-type', task.key);
  businessObject.name = task.label;

  const options = { type: task.type, businessObject };
  if (taskKey === 'decisionNode') {
    options.width = 80;
    options.height = 80;
  }
  const shape = services.value.elementFactory.createShape(options);
  services.value.create.start(event, shape);
  const canvas = modeler.value.get('canvas');
  // marker kaldırıldı
};

const zoomIn = () => {
  if (!modeler.value) return;
  const canvas = modeler.value.get('canvas');
  const current = canvas.zoom();
  canvas.zoom(Math.min(current + 0.2, 3));
};

const zoomOut = () => {
  if (!modeler.value) return;
  const canvas = modeler.value.get('canvas');
  const current = canvas.zoom();
  canvas.zoom(Math.max(current - 0.2, 0.2));
};

const resetZoom = () => {
  if (!modeler.value) return;
  const canvas = modeler.value.get('canvas');
  canvas.zoom('fit-viewport');
};

// eski fieldDefs kaldırıldı; doküman tabanlı fieldDefs yukarıda tanımlı

const openModal = (element) => {
  const taskKey = (element.businessObject.get && element.businessObject.get('data-task-type')) || element.businessObject.$attrs?.['data-task-type'];
  modalElement.value = element;
  modalElementId.value = element.id;
  formState.value = {
    name: element.businessObject.name || '',
    taskKey,
    fields: loadCustomFields(element, taskKey)
  };
  showModal.value = true;
};

const loadCustomFields = (element, taskKey) => {
  const rawElement = toRaw(element);
  const attrs = (rawElement.businessObject && rawElement.businessObject.$attrs) || {};
  const def = fieldDefs[taskKey] || [];
  return def.reduce((acc, field) => {
    let val = attrs[`data-${field.key}`];
    
    if (field.type === 'checkbox') {
      acc[field.key] = val === 'true' || val === true;
    } else if (field.type === 'events-table' || field.type === 'decision-table' || field.type === 'key-value-table') {
      // JSON parse for events
      try {
        acc[field.key] = val ? JSON.parse(val) : [];
      } catch (e) {
        acc[field.key] = [];
      }
      
      // Add default events for UserTask and UserGroupTask if empty
      if ((field.type === 'events-table') && (taskKey === 'userTask' || taskKey === 'userGroupTask') && acc[field.key].length === 0) {
        acc[field.key] = [
          { name: 'Onayla', key: 'approve', icon: 'check', color: '#10b981' },
          { name: 'Reddet', key: 'reject', icon: 'times', color: '#ef4444' }
        ];
      }
    } else {
      acc[field.key] = val || '';
    }
    return acc;
  }, {});
};

const addEvent = (fieldKey) => {
  if (!formState.value.fields[fieldKey]) {
    formState.value.fields[fieldKey] = [];
  }
  formState.value.fields[fieldKey].push({ name: '', key: '', icon: '', color: '#000000' });
};

const addDecisionRule = (fieldKey) => {
  if (!formState.value.fields[fieldKey]) {
    formState.value.fields[fieldKey] = [];
  }
  formState.value.fields[fieldKey].push({ label: '', condition: '' });
};

const addKeyValue = (fieldKey) => {
  if (!formState.value.fields[fieldKey]) {
    formState.value.fields[fieldKey] = [];
  }
  formState.value.fields[fieldKey].push({ key: '', value: '' });
};

const removeEvent = (fieldKey, idx) => {
  if (formState.value.fields[fieldKey]) {
    formState.value.fields[fieldKey].splice(idx, 1);
  }
};

const saveModal = () => {
  if (!modalElement.value || !modeler.value) return;
  const modeling = modeler.value.get('modeling');
  const elementRegistry = modeler.value.get('elementRegistry');
  const { name, taskKey, fields } = formState.value;

  const element = modalElementId.value ? elementRegistry.get(modalElementId.value) : toRaw(modalElement.value);
  if (!element) return;
  const props = { name };

  (fieldDefs[taskKey] || []).forEach((field) => {
    const key = `data-${field.key}`;
    let val = fields[field.key];
    
    if (field.type === 'checkbox') {
      val = val ? 'true' : 'false';
    } else if (field.type === 'events-table' || field.type === 'decision-table' || field.type === 'key-value-table') {
      val = val && val.length > 0 ? JSON.stringify(val) : '';
    }
    
    props[key] = val ?? '';
    // Also set property on businessObject directly for immediate access if needed (optional but good for syncing)
    if (field.key === 'customOutputEvents') {
      element.businessObject.customOutputEvents = val;
    }
  });

  modeling.updateProperties(element, props);

  showModal.value = false;
  modalElement.value = null;
  modalElementId.value = null;
};

const closeModal = () => {
  showModal.value = false;
  modalElement.value = null;
  modalElementId.value = null;
};
</script>
