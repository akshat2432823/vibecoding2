#!/usr/bin/env python3
"""
Test script to verify the delete all accounts functionality
"""

import requests
import json

def test_delete_all_accounts():
    """Test the delete all accounts endpoint"""
    try:
        # First, check if there are any accounts
        print("🔍 Checking current accounts...")
        response = requests.get("http://localhost:8000/accounts/")
        if response.status_code == 200:
            accounts = response.json()
            print(f"   Found {len(accounts)} accounts")
        else:
            print(f"   Error getting accounts: {response.status_code}")
            return
        
        if len(accounts) == 0:
            print("   No accounts to delete")
            return
        
        # Test the delete all endpoint
        print("🗑️  Testing delete all endpoint...")
        response = requests.delete("http://localhost:8000/accounts/delete-all/")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Delete all successful!")
            print(f"   Message: {result['message']}")
            print("   Deleted counts:")
            for key, value in result['deleted_counts'].items():
                print(f"     • {key}: {value}")
        else:
            print(f"❌ Delete all failed: {response.status_code}")
            print(f"   Response: {response.text}")
        
        # Verify accounts are deleted
        print("🔍 Verifying deletion...")
        response = requests.get("http://localhost:8000/accounts/")
        if response.status_code == 200:
            accounts = response.json()
            print(f"   Remaining accounts: {len(accounts)}")
            if len(accounts) == 0:
                print("✅ All accounts successfully deleted!")
            else:
                print("⚠️  Some accounts still remain")
        
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to server. Make sure the backend is running on http://localhost:8000")
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    test_delete_all_accounts() 