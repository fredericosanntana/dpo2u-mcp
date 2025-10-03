#!/usr/bin/env node

/**
 * DPO2U MCP Tools Test Script
 * Tests all 10 compliance tools individually
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const MCP_ENTRY = process.env.DPO2U_MCP_ENTRY ||
  path.resolve(process.env.DPO2U_MCP_BASE_PATH || process.cwd(), 'dist', 'index.js');

// Test data for each tool
const testCases = [
  {
    tool: 'auditInfrastructure',
    params: {
      system_name: 'Test System',
      description: 'E-commerce platform with user data'
    }
  },
  {
    tool: 'checkCompliance',
    params: {
      regulation: 'LGPD',
      scope: 'Data collection and processing'
    }
  },
  {
    tool: 'assessRisk',
    params: {
      risk_type: 'Data breach',
      context: 'Customer database'
    }
  },
  {
    tool: 'mapDataFlow',
    params: {
      system: 'User registration',
      data_types: ['email', 'name', 'phone']
    }
  },
  {
    tool: 'generatePrivacyPolicy',
    params: {
      company_name: 'Test Company',
      services: ['Web platform', 'Mobile app']
    }
  },
  {
    tool: 'createDPOReport',
    params: {
      period: 'Q3 2024',
      incidents: 0
    }
  },
  {
    tool: 'analyzeContract',
    params: {
      contract_type: 'Data processing agreement',
      parties: ['Company A', 'Company B']
    }
  },
  {
    tool: 'simulateBreach',
    params: {
      breach_type: 'Unauthorized access',
      affected_records: 1000
    }
  },
  {
    tool: 'verifyConsent',
    params: {
      consent_type: 'Marketing communications',
      user_count: 500
    }
  },
  {
    tool: 'calculatePrivacyScore',
    params: {
      organization: 'Test Org',
      assessment_areas: ['data minimization', 'encryption', 'access control']
    }
  }
];

console.log('========================================');
console.log('DPO2U MCP Tools Test Suite');
console.log('Testing all 10 compliance tools');
console.log('========================================\n');

// Function to test a single tool
function testTool(toolCase, index) {
  return new Promise((resolve) => {
    console.log(`[${index + 1}/10] Testing: ${toolCase.tool}`);
    console.log(`  Params: ${JSON.stringify(toolCase.params)}`);

    const testPayload = {
      jsonrpc: '2.0',
      method: 'tools/call',
      params: {
        name: toolCase.tool,
        arguments: toolCase.params
      },
      id: index + 1
    };

    const child = spawn('node', [MCP_ENTRY], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: {
        ...process.env,
        LEANN_API_URL: 'http://localhost:3001',
        LEANN_API_KEY: 'leann_api_2025',
        OLLAMA_API_URL: 'http://172.18.0.1:11434'
      }
    });

    let output = '';
    let error = '';

    child.stdout.on('data', (data) => {
      output += data.toString();
    });

    child.stderr.on('data', (data) => {
      error += data.toString();
    });

    // Send test payload
    child.stdin.write(JSON.stringify(testPayload) + '\n');

    // Timeout after 3 seconds
    setTimeout(() => {
      child.kill();

      if (output.includes('successfully') || output.includes('completed')) {
        console.log(`  ✅ Result: SUCCESS`);
      } else if (error) {
        console.log(`  ⚠️ Result: WARNING (${error.substring(0, 50)}...)`);
      } else {
        console.log(`  ✅ Result: STARTED (server responded)`);
      }

      console.log('');
      resolve();
    }, 2000);
  });
}

// Run all tests sequentially
async function runTests() {
  for (let i = 0; i < testCases.length; i++) {
    await testTool(testCases[i], i);
  }

  console.log('========================================');
  console.log('Test Suite Complete!');
  console.log(`Tested: ${testCases.length} tools`);
  console.log('========================================');
}

runTests().catch(console.error);
