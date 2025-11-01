/**
 * Sample Organizational Data
 * 
 * This is a demonstration dataset representing a fictional organization
 * with 12 domains, 60 elemental KPIs (5 per face), and 30 edge KPIs
 */

import { KPI } from '../models/KPI.js';

export function getSampleData() {
  return {
    faces: [
      {
        id: 1,
        name: 'Vision & Strategy',
        archetype: 'The Seer',
        color: '#9b59b6',
        elementalKPIs: [
          new KPI({
            id: 'F1_K1',
            name: 'Strategic Clarity',
            direction: '↑',
            healthyMin: 60,
            healthyMax: 100,
            value: 75,
            weight: 1.0,
            faceId: 1,
            primaryOctave: 'Vision'
          }),
          new KPI({
            id: 'F1_K2',
            name: 'Market Alignment',
            direction: '↑',
            healthyMin: 50,
            healthyMax: 100,
            value: 68,
            weight: 1.0,
            faceId: 1,
            primaryOctave: 'Vision'
          }),
          new KPI({
            id: 'F1_K3',
            name: 'Innovation Index',
            direction: '↑',
            healthyMin: 55,
            healthyMax: 100,
            value: 82,
            weight: 1.0,
            faceId: 1,
            primaryOctave: 'Vision'
          }),
          new KPI({
            id: 'F1_K4',
            name: 'Goal Coherence',
            direction: '↑',
            healthyMin: 70,
            healthyMax: 100,
            value: 71,
            weight: 1.0,
            faceId: 1,
            primaryOctave: 'Vision'
          }),
          new KPI({
            id: 'F1_K5',
            name: 'Strategic Agility',
            direction: '↑',
            healthyMin: 60,
            healthyMax: 100,
            value: 78,
            weight: 1.0,
            faceId: 1,
            primaryOctave: 'Vision'
          })
        ]
      },
      {
        id: 2,
        name: 'Leadership & Governance',
        archetype: 'The Conductor',
        color: '#e74c3c',
        elementalKPIs: [
          new KPI({
            id: 'F2_K1',
            name: 'Leadership Trust',
            direction: '↑',
            healthyMin: 70,
            healthyMax: 100,
            value: 65,
            weight: 1.2,
            faceId: 2,
            primaryOctave: 'Authority'
          }),
          new KPI({
            id: 'F2_K2',
            name: 'Decision Speed',
            direction: '↑',
            healthyMin: 60,
            healthyMax: 100,
            value: 72,
            weight: 1.0,
            faceId: 2,
            primaryOctave: 'Authority'
          }),
          new KPI({
            id: 'F2_K3',
            name: 'Governance Clarity',
            direction: '↑',
            healthyMin: 65,
            healthyMax: 100,
            value: 80,
            weight: 1.0,
            faceId: 2,
            primaryOctave: 'Authority'
          }),
          new KPI({
            id: 'F2_K4',
            name: 'Authority Distribution',
            direction: 'Band',
            healthyMin: 40,
            healthyMax: 70,
            value: 55,
            weight: 0.9,
            faceId: 2,
            primaryOctave: 'Authority'
          }),
          new KPI({
            id: 'F2_K5',
            name: 'Executive Alignment',
            direction: '↑',
            healthyMin: 75,
            healthyMax: 100,
            value: 68,
            weight: 1.1,
            faceId: 2,
            primaryOctave: 'Authority'
          })
        ]
      },
      {
        id: 3,
        name: 'People & Culture',
        archetype: 'The Gardener',
        color: '#2ecc71',
        elementalKPIs: [
          new KPI({
            id: 'F3_K1',
            name: 'Employee Engagement',
            direction: '↑',
            healthyMin: 70,
            healthyMax: 100,
            value: 58,
            weight: 1.3,
            faceId: 3,
            primaryOctave: 'Heart'
          }),
          new KPI({
            id: 'F3_K2',
            name: 'Psychological Safety',
            direction: '↑',
            healthyMin: 75,
            healthyMax: 100,
            value: 62,
            weight: 1.2,
            faceId: 3,
            primaryOctave: 'Heart'
          }),
          new KPI({
            id: 'F3_K3',
            name: 'Cultural Coherence',
            direction: '↑',
            healthyMin: 65,
            healthyMax: 100,
            value: 71,
            weight: 1.0,
            faceId: 3,
            primaryOctave: 'Heart'
          }),
          new KPI({
            id: 'F3_K4',
            name: 'Talent Retention',
            direction: '↑',
            healthyMin: 80,
            healthyMax: 95,
            value: 74,
            weight: 1.1,
            faceId: 3,
            primaryOctave: 'Heart'
          }),
          new KPI({
            id: 'F3_K5',
            name: 'Learning Velocity',
            direction: '↑',
            healthyMin: 60,
            healthyMax: 100,
            value: 66,
            weight: 1.0,
            faceId: 3,
            primaryOctave: 'Heart'
          })
        ]
      },
      {
        id: 4,
        name: 'Operations & Execution',
        archetype: 'The Builder',
        color: '#f39c12',
        elementalKPIs: [
          new KPI({
            id: 'F4_K1',
            name: 'Operational Efficiency',
            direction: '↑',
            healthyMin: 70,
            healthyMax: 95,
            value: 81,
            weight: 1.0,
            faceId: 4,
            primaryOctave: 'Action'
          }),
          new KPI({
            id: 'F4_K2',
            name: 'Process Adherence',
            direction: '↑',
            healthyMin: 75,
            healthyMax: 100,
            value: 86,
            weight: 0.9,
            faceId: 4,
            primaryOctave: 'Action'
          }),
          new KPI({
            id: 'F4_K3',
            name: 'Quality Score',
            direction: '↑',
            healthyMin: 85,
            healthyMax: 100,
            value: 89,
            weight: 1.2,
            faceId: 4,
            primaryOctave: 'Action'
          }),
          new KPI({
            id: 'F4_K4',
            name: 'Delivery Speed',
            direction: '↑',
            healthyMin: 65,
            healthyMax: 95,
            value: 78,
            weight: 1.0,
            faceId: 4,
            primaryOctave: 'Action'
          }),
          new KPI({
            id: 'F4_K5',
            name: 'Resource Utilization',
            direction: 'Band',
            healthyMin: 70,
            healthyMax: 90,
            value: 84,
            weight: 0.9,
            faceId: 4,
            primaryOctave: 'Action'
          })
        ]
      },
      {
        id: 5,
        name: 'Financial Health',
        archetype: 'The Steward',
        color: '#3498db',
        elementalKPIs: [
          new KPI({
            id: 'F5_K1',
            name: 'Revenue Growth',
            direction: '↑',
            healthyMin: 10,
            healthyMax: 30,
            value: 15,
            weight: 1.2,
            faceId: 5,
            primaryOctave: 'Abundance'
          }),
          new KPI({
            id: 'F5_K2',
            name: 'Profit Margin',
            direction: '↑',
            healthyMin: 15,
            healthyMax: 35,
            value: 22,
            weight: 1.3,
            faceId: 5,
            primaryOctave: 'Abundance'
          }),
          new KPI({
            id: 'F5_K3',
            name: 'Cash Flow Health',
            direction: '↑',
            healthyMin: 70,
            healthyMax: 100,
            value: 79,
            weight: 1.1,
            faceId: 5,
            primaryOctave: 'Abundance'
          }),
          new KPI({
            id: 'F5_K4',
            name: 'Cost Efficiency',
            direction: '↓',
            healthyMin: 0,
            healthyMax: 30,
            value: 25,
            weight: 1.0,
            faceId: 5,
            primaryOctave: 'Abundance'
          }),
          new KPI({
            id: 'F5_K5',
            name: 'Investment ROI',
            direction: '↑',
            healthyMin: 12,
            healthyMax: 40,
            value: 18,
            weight: 1.1,
            faceId: 5,
            primaryOctave: 'Abundance'
          })
        ]
      },
      {
        id: 6,
        name: 'Customer Experience',
        archetype: 'The Servant',
        color: '#1abc9c',
        elementalKPIs: [
          new KPI({
            id: 'F6_K1',
            name: 'Customer Satisfaction',
            direction: '↑',
            healthyMin: 80,
            healthyMax: 100,
            value: 77,
            weight: 1.3,
            faceId: 6,
            primaryOctave: 'Service'
          }),
          new KPI({
            id: 'F6_K2',
            name: 'Net Promoter Score',
            direction: '↑',
            healthyMin: 40,
            healthyMax: 80,
            value: 52,
            weight: 1.2,
            faceId: 6,
            primaryOctave: 'Service'
          }),
          new KPI({
            id: 'F6_K3',
            name: 'Response Time',
            direction: '↓',
            healthyMin: 0,
            healthyMax: 24,
            value: 18,
            weight: 1.0,
            faceId: 6,
            primaryOctave: 'Service'
          }),
          new KPI({
            id: 'F6_K4',
            name: 'Issue Resolution Rate',
            direction: '↑',
            healthyMin: 85,
            healthyMax: 100,
            value: 88,
            weight: 1.1,
            faceId: 6,
            primaryOctave: 'Service'
          }),
          new KPI({
            id: 'F6_K5',
            name: 'Customer Lifetime Value',
            direction: '↑',
            healthyMin: 60,
            healthyMax: 100,
            value: 73,
            weight: 1.2,
            faceId: 6,
            primaryOctave: 'Service'
          })
        ]
      },
      {
        id: 7,
        name: 'Technology & Innovation',
        archetype: 'The Alchemist',
        color: '#9c27b0',
        elementalKPIs: [
          new KPI({
            id: 'F7_K1',
            name: 'Tech Stack Modernity',
            direction: '↑',
            healthyMin: 60,
            healthyMax: 95,
            value: 72,
            weight: 1.0,
            faceId: 7,
            primaryOctave: 'Innovation'
          }),
          new KPI({
            id: 'F7_K2',
            name: 'System Reliability',
            direction: '↑',
            healthyMin: 95,
            healthyMax: 99.9,
            value: 97.5,
            weight: 1.3,
            faceId: 7,
            primaryOctave: 'Innovation'
          }),
          new KPI({
            id: 'F7_K3',
            name: 'Innovation Pipeline',
            direction: '↑',
            healthyMin: 50,
            healthyMax: 100,
            value: 64,
            weight: 1.1,
            faceId: 7,
            primaryOctave: 'Innovation'
          }),
          new KPI({
            id: 'F7_K4',
            name: 'Technical Debt',
            direction: '↓',
            healthyMin: 0,
            healthyMax: 25,
            value: 32,
            weight: 1.2,
            faceId: 7,
            primaryOctave: 'Innovation'
          }),
          new KPI({
            id: 'F7_K5',
            name: 'Automation Level',
            direction: '↑',
            healthyMin: 60,
            healthyMax: 95,
            value: 68,
            weight: 1.0,
            faceId: 7,
            primaryOctave: 'Innovation'
          })
        ]
      },
      {
        id: 8,
        name: 'Communication & Transparency',
        archetype: 'The Messenger',
        color: '#00bcd4',
        elementalKPIs: [
          new KPI({
            id: 'F8_K1',
            name: 'Information Flow',
            direction: '↑',
            healthyMin: 65,
            healthyMax: 100,
            value: 61,
            weight: 1.2,
            faceId: 8,
            primaryOctave: 'Communication'
          }),
          new KPI({
            id: 'F8_K2',
            name: 'Transparency Score',
            direction: '↑',
            healthyMin: 70,
            healthyMax: 100,
            value: 68,
            weight: 1.1,
            faceId: 8,
            primaryOctave: 'Communication'
          }),
          new KPI({
            id: 'F8_K3',
            name: 'Cross-Team Collaboration',
            direction: '↑',
            healthyMin: 60,
            healthyMax: 100,
            value: 64,
            weight: 1.2,
            faceId: 8,
            primaryOctave: 'Communication'
          }),
          new KPI({
            id: 'F8_K4',
            name: 'Meeting Efficiency',
            direction: '↑',
            healthyMin: 55,
            healthyMax: 90,
            value: 59,
            weight: 0.9,
            faceId: 8,
            primaryOctave: 'Communication'
          }),
          new KPI({
            id: 'F8_K5',
            name: 'Knowledge Sharing',
            direction: '↑',
            healthyMin: 60,
            healthyMax: 100,
            value: 67,
            weight: 1.0,
            faceId: 8,
            primaryOctave: 'Communication'
          })
        ]
      },
      {
        id: 9,
        name: 'Risk & Compliance',
        archetype: 'The Guardian',
        color: '#ff5722',
        elementalKPIs: [
          new KPI({
            id: 'F9_K1',
            name: 'Compliance Rate',
            direction: '↑',
            healthyMin: 95,
            healthyMax: 100,
            value: 98,
            weight: 1.3,
            faceId: 9,
            primaryOctave: 'Protection'
          }),
          new KPI({
            id: 'F9_K2',
            name: 'Risk Mitigation',
            direction: '↑',
            healthyMin: 75,
            healthyMax: 100,
            value: 83,
            weight: 1.1,
            faceId: 9,
            primaryOctave: 'Protection'
          }),
          new KPI({
            id: 'F9_K3',
            name: 'Security Score',
            direction: '↑',
            healthyMin: 85,
            healthyMax: 100,
            value: 91,
            weight: 1.3,
            faceId: 9,
            primaryOctave: 'Protection'
          }),
          new KPI({
            id: 'F9_K4',
            name: 'Incident Response Time',
            direction: '↓',
            healthyMin: 0,
            healthyMax: 4,
            value: 2.5,
            weight: 1.2,
            faceId: 9,
            primaryOctave: 'Protection'
          }),
          new KPI({
            id: 'F9_K5',
            name: 'Audit Readiness',
            direction: '↑',
            healthyMin: 80,
            healthyMax: 100,
            value: 87,
            weight: 1.0,
            faceId: 9,
            primaryOctave: 'Protection'
          })
        ]
      },
      {
        id: 10,
        name: 'Partnerships & Ecosystem',
        archetype: 'The Weaver',
        color: '#cddc39',
        elementalKPIs: [
          new KPI({
            id: 'F10_K1',
            name: 'Partner Satisfaction',
            direction: '↑',
            healthyMin: 70,
            healthyMax: 100,
            value: 74,
            weight: 1.1,
            faceId: 10,
            primaryOctave: 'Network'
          }),
          new KPI({
            id: 'F10_K2',
            name: 'Ecosystem Value',
            direction: '↑',
            healthyMin: 60,
            healthyMax: 100,
            value: 69,
            weight: 1.0,
            faceId: 10,
            primaryOctave: 'Network'
          }),
          new KPI({
            id: 'F10_K3',
            name: 'Integration Depth',
            direction: '↑',
            healthyMin: 50,
            healthyMax: 95,
            value: 63,
            weight: 1.0,
            faceId: 10,
            primaryOctave: 'Network'
          }),
          new KPI({
            id: 'F10_K4',
            name: 'Network Effects',
            direction: '↑',
            healthyMin: 55,
            healthyMax: 100,
            value: 58,
            weight: 1.2,
            faceId: 10,
            primaryOctave: 'Network'
          }),
          new KPI({
            id: 'F10_K5',
            name: 'Strategic Alliances',
            direction: '↑',
            healthyMin: 60,
            healthyMax: 100,
            value: 71,
            weight: 1.0,
            faceId: 10,
            primaryOctave: 'Network'
          })
        ]
      },
      {
        id: 11,
        name: 'Sustainability & Impact',
        archetype: 'The Steward of Earth',
        color: '#4caf50',
        elementalKPIs: [
          new KPI({
            id: 'F11_K1',
            name: 'Environmental Score',
            direction: '↑',
            healthyMin: 65,
            healthyMax: 100,
            value: 71,
            weight: 1.2,
            faceId: 11,
            primaryOctave: 'Sustainability'
          }),
          new KPI({
            id: 'F11_K2',
            name: 'Social Impact',
            direction: '↑',
            healthyMin: 60,
            healthyMax: 100,
            value: 68,
            weight: 1.1,
            faceId: 11,
            primaryOctave: 'Sustainability'
          }),
          new KPI({
            id: 'F11_K3',
            name: 'Resource Efficiency',
            direction: '↑',
            healthyMin: 70,
            healthyMax: 100,
            value: 75,
            weight: 1.0,
            faceId: 11,
            primaryOctave: 'Sustainability'
          }),
          new KPI({
            id: 'F11_K4',
            name: 'Carbon Footprint',
            direction: '↓',
            healthyMin: 0,
            healthyMax: 30,
            value: 28,
            weight: 1.2,
            faceId: 11,
            primaryOctave: 'Sustainability'
          }),
          new KPI({
            id: 'F11_K5',
            name: 'Circular Economy Index',
            direction: '↑',
            healthyMin: 50,
            healthyMax: 100,
            value: 62,
            weight: 1.0,
            faceId: 11,
            primaryOctave: 'Sustainability'
          })
        ]
      },
      {
        id: 12,
        name: 'Learning & Adaptation',
        archetype: 'The Sage',
        color: '#ff9800',
        elementalKPIs: [
          new KPI({
            id: 'F12_K1',
            name: 'Organizational Learning',
            direction: '↑',
            healthyMin: 60,
            healthyMax: 100,
            value: 67,
            weight: 1.2,
            faceId: 12,
            primaryOctave: 'Wisdom'
          }),
          new KPI({
            id: 'F12_K2',
            name: 'Adaptability Score',
            direction: '↑',
            healthyMin: 65,
            healthyMax: 100,
            value: 72,
            weight: 1.1,
            faceId: 12,
            primaryOctave: 'Wisdom'
          }),
          new KPI({
            id: 'F12_K3',
            name: 'Experimentation Rate',
            direction: '↑',
            healthyMin: 55,
            healthyMax: 95,
            value: 64,
            weight: 1.0,
            faceId: 12,
            primaryOctave: 'Wisdom'
          }),
          new KPI({
            id: 'F12_K4',
            name: 'Feedback Integration',
            direction: '↑',
            healthyMin: 70,
            healthyMax: 100,
            value: 69,
            weight: 1.1,
            faceId: 12,
            primaryOctave: 'Wisdom'
          }),
          new KPI({
            id: 'F12_K5',
            name: 'Knowledge Retention',
            direction: '↑',
            healthyMin: 75,
            healthyMax: 100,
            value: 76,
            weight: 1.0,
            faceId: 12,
            primaryOctave: 'Wisdom'
          })
        ]
      }
    ],
    edges: [
      // Edges connecting faces (30 total in a dodecahedron)
      { id: 'E1-2', face1Id: 1, face2Id: 2, elementalNature: 'Fire', edgeKPI: new KPI({ id: 'E1-2_K', name: 'Vision-Leadership Alignment', direction: '↑', healthyMin: 70, healthyMax: 100, value: 76, weight: 1.0 }) },
      { id: 'E1-3', face1Id: 1, face2Id: 3, elementalNature: 'Air', edgeKPI: new KPI({ id: 'E1-3_K', name: 'Strategic Culture Fit', direction: '↑', healthyMin: 65, healthyMax: 100, value: 71, weight: 1.0 }) },
      { id: 'E1-12', face1Id: 1, face2Id: 12, elementalNature: 'Ether', edgeKPI: new KPI({ id: 'E1-12_K', name: 'Vision-Learning Loop', direction: '↑', healthyMin: 60, healthyMax: 100, value: 69, weight: 1.0 }) },
      { id: 'E2-3', face1Id: 2, face2Id: 3, elementalNature: 'Water', edgeKPI: new KPI({ id: 'E2-3_K', name: 'Leadership-Culture Bond', direction: '↑', healthyMin: 70, healthyMax: 100, value: 64, weight: 1.1 }) },
      { id: 'E2-4', face1Id: 2, face2Id: 4, elementalNature: 'Fire', edgeKPI: new KPI({ id: 'E2-4_K', name: 'Leadership-Operations Drive', direction: '↑', healthyMin: 65, healthyMax: 100, value: 78, weight: 1.0 }) },
      { id: 'E3-4', face1Id: 3, face2Id: 4, elementalNature: 'Earth', edgeKPI: new KPI({ id: 'E3-4_K', name: 'People-Operations Synergy', direction: '↑', healthyMin: 60, healthyMax: 100, value: 68, weight: 1.0 }) },
      { id: 'E3-8', face1Id: 3, face2Id: 8, elementalNature: 'Air', edgeKPI: new KPI({ id: 'E3-8_K', name: 'Culture-Communication Flow', direction: '↑', healthyMin: 65, healthyMax: 100, value: 62, weight: 1.1 }) },
      { id: 'E4-5', face1Id: 4, face2Id: 5, elementalNature: 'Earth', edgeKPI: new KPI({ id: 'E4-5_K', name: 'Operations-Finance Efficiency', direction: '↑', healthyMin: 70, healthyMax: 100, value: 82, weight: 1.0 }) },
      { id: 'E4-6', face1Id: 4, face2Id: 6, elementalNature: 'Water', edgeKPI: new KPI({ id: 'E4-6_K', name: 'Operations-Customer Delivery', direction: '↑', healthyMin: 75, healthyMax: 100, value: 81, weight: 1.2 }) },
      { id: 'E5-6', face1Id: 5, face2Id: 6, elementalNature: 'Earth', edgeKPI: new KPI({ id: 'E5-6_K', name: 'Finance-Customer Value', direction: '↑', healthyMin: 65, healthyMax: 100, value: 74, weight: 1.0 }) },
      { id: 'E5-9', face1Id: 5, face2Id: 9, elementalNature: 'Water', edgeKPI: new KPI({ id: 'E5-9_K', name: 'Finance-Risk Balance', direction: 'Band', healthyMin: 50, healthyMax: 80, value: 67, weight: 1.0 }) },
      { id: 'E6-7', face1Id: 6, face2Id: 7, elementalNature: 'Fire', edgeKPI: new KPI({ id: 'E6-7_K', name: 'Customer-Tech Innovation', direction: '↑', healthyMin: 60, healthyMax: 100, value: 72, weight: 1.0 }) },
      { id: 'E6-10', face1Id: 6, face2Id: 10, elementalNature: 'Air', edgeKPI: new KPI({ id: 'E6-10_K', name: 'Customer-Partner Network', direction: '↑', healthyMin: 65, healthyMax: 100, value: 71, weight: 1.0 }) },
      { id: 'E7-8', face1Id: 7, face2Id: 8, elementalNature: 'Air', edgeKPI: new KPI({ id: 'E7-8_K', name: 'Tech-Communication Tools', direction: '↑', healthyMin: 70, healthyMax: 100, value: 75, weight: 1.0 }) },
      { id: 'E7-12', face1Id: 7, face2Id: 12, elementalNature: 'Ether', edgeKPI: new KPI({ id: 'E7-12_K', name: 'Tech-Learning Integration', direction: '↑', healthyMin: 60, healthyMax: 100, value: 68, weight: 1.0 }) },
      { id: 'E8-9', face1Id: 8, face2Id: 9, elementalNature: 'Water', edgeKPI: new KPI({ id: 'E8-9_K', name: 'Communication-Compliance Transparency', direction: '↑', healthyMin: 75, healthyMax: 100, value: 79, weight: 1.0 }) },
      { id: 'E8-12', face1Id: 8, face2Id: 12, elementalNature: 'Air', edgeKPI: new KPI({ id: 'E8-12_K', name: 'Communication-Learning Exchange', direction: '↑', healthyMin: 65, healthyMax: 100, value: 66, weight: 1.0 }) },
      { id: 'E9-10', face1Id: 9, face2Id: 10, elementalNature: 'Earth', edgeKPI: new KPI({ id: 'E9-10_K', name: 'Risk-Partnership Security', direction: '↑', healthyMin: 70, healthyMax: 100, value: 81, weight: 1.1 }) },
      { id: 'E9-11', face1Id: 9, face2Id: 11, elementalNature: 'Earth', edgeKPI: new KPI({ id: 'E9-11_K', name: 'Compliance-Sustainability Alignment', direction: '↑', healthyMin: 65, healthyMax: 100, value: 78, weight: 1.0 }) },
      { id: 'E10-11', face1Id: 10, face2Id: 11, elementalNature: 'Water', edgeKPI: new KPI({ id: 'E10-11_K', name: 'Partnership-Impact Ecosystem', direction: '↑', healthyMin: 60, healthyMax: 100, value: 70, weight: 1.0 }) },
      { id: 'E10-12', face1Id: 10, face2Id: 12, elementalNature: 'Air', edgeKPI: new KPI({ id: 'E10-12_K', name: 'Network-Learning Sharing', direction: '↑', healthyMin: 55, healthyMax: 100, value: 65, weight: 1.0 }) },
      { id: 'E11-12', face1Id: 11, face2Id: 12, elementalNature: 'Ether', edgeKPI: new KPI({ id: 'E11-12_K', name: 'Sustainability-Wisdom Integration', direction: '↑', healthyMin: 60, healthyMax: 100, value: 72, weight: 1.0 }) },
      // Additional edges to complete the 30-edge dodecahedron structure
      { id: 'E1-4', face1Id: 1, face2Id: 4, elementalNature: 'Fire', edgeKPI: new KPI({ id: 'E1-4_K', name: 'Strategy-Execution Link', direction: '↑', healthyMin: 70, healthyMax: 100, value: 74, weight: 1.1 }) },
      { id: 'E1-7', face1Id: 1, face2Id: 7, elementalNature: 'Ether', edgeKPI: new KPI({ id: 'E1-7_K', name: 'Vision-Innovation Alignment', direction: '↑', healthyMin: 65, healthyMax: 100, value: 77, weight: 1.0 }) },
      { id: 'E2-5', face1Id: 2, face2Id: 5, elementalNature: 'Earth', edgeKPI: new KPI({ id: 'E2-5_K', name: 'Governance-Financial Oversight', direction: '↑', healthyMin: 75, healthyMax: 100, value: 79, weight: 1.1 }) },
      { id: 'E3-6', face1Id: 3, face2Id: 6, elementalNature: 'Water', edgeKPI: new KPI({ id: 'E3-6_K', name: 'Culture-Service Connection', direction: '↑', healthyMin: 70, healthyMax: 100, value: 67, weight: 1.0 }) },
      { id: 'E5-7', face1Id: 5, face2Id: 7, elementalNature: 'Fire', edgeKPI: new KPI({ id: 'E5-7_K', name: 'Finance-Tech Investment', direction: '↑', healthyMin: 60, healthyMax: 100, value: 73, weight: 1.0 }) },
      { id: 'E7-9', face1Id: 7, face2Id: 9, elementalNature: 'Earth', edgeKPI: new KPI({ id: 'E7-9_K', name: 'Tech-Security Integration', direction: '↑', healthyMin: 80, healthyMax: 100, value: 86, weight: 1.2 }) },
      { id: 'E7-10', face1Id: 7, face2Id: 10, elementalNature: 'Air', edgeKPI: new KPI({ id: 'E7-10_K', name: 'Tech-Partnership Platform', direction: '↑', healthyMin: 65, healthyMax: 100, value: 69, weight: 1.0 }) },
      { id: 'E11-1', face1Id: 11, face2Id: 1, elementalNature: 'Ether', edgeKPI: new KPI({ id: 'E11-1_K', name: 'Sustainability-Vision Harmony', direction: '↑', healthyMin: 60, healthyMax: 100, value: 73, weight: 1.0 }) }
    ],
    vertices: [
      { id: 1, faceIds: [1, 2, 3], name: 'Leadership Nexus', archetype: 'Command Center' },
      { id: 2, faceIds: [1, 2, 4], name: 'Strategic Execution', archetype: 'Action Point' },
      { id: 3, faceIds: [1, 3, 12], name: 'Cultural Vision', archetype: 'Identity Core' },
      { id: 4, faceIds: [2, 3, 4], name: 'Operational Heart', archetype: 'Engine Room' },
      { id: 5, faceIds: [2, 4, 5], name: 'Financial Command', archetype: 'Resource Hub' },
      { id: 6, faceIds: [3, 4, 6], name: 'Service Core', archetype: 'Delivery Center' },
      { id: 7, faceIds: [3, 6, 8], name: 'Experience Network', archetype: 'Touch Point' },
      { id: 8, faceIds: [4, 5, 6], name: 'Value Creation', archetype: 'Growth Engine' },
      { id: 9, faceIds: [5, 6, 9], name: 'Trust Foundation', archetype: 'Stability Point' },
      { id: 10, faceIds: [6, 7, 10], name: 'Innovation Interface', archetype: 'Future Gateway' },
      { id: 11, faceIds: [7, 8, 12], name: 'Knowledge Flow', archetype: 'Learning Hub' },
      { id: 12, faceIds: [8, 9, 12], name: 'Wisdom Guard', archetype: 'Protection Point' },
      { id: 13, faceIds: [9, 10, 11], name: 'Ecosystem Balance', archetype: 'Network Anchor' },
      { id: 14, faceIds: [10, 11, 12], name: 'Sustainable Growth', archetype: 'Long-term Nexus' },
      { id: 15, faceIds: [1, 7, 12], name: 'Visionary Learning', archetype: 'Evolution Point' },
      { id: 16, faceIds: [1, 4, 7], name: 'Strategic Innovation', archetype: 'Breakthrough Zone' },
      { id: 17, faceIds: [5, 7, 9], name: 'Security Investment', archetype: 'Risk-Reward Balance' },
      { id: 18, faceIds: [7, 9, 10], name: 'Protected Network', archetype: 'Safe Expansion' },
      { id: 19, faceIds: [2, 5, 9], name: 'Governance Shield', archetype: 'Control Center' },
      { id: 20, faceIds: [1, 11, 12], name: 'Wisdom Vision', archetype: 'Purpose Core' }
    ]
  };
}

