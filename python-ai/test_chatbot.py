"""
Test Script for NISR AI Chatbot
Run comprehensive tests to validate functionality
"""

import os
import sys
from dotenv import load_dotenv
from chatbot import NISRAIChatbot

# Load environment
load_dotenv()


def test_chatbot():
    """Run comprehensive tests"""
    print("=== NISR AI Chatbot Test Suite ===\n")
    
    # Check API key
    if not os.getenv("GROQ_API_KEY"):
        print("✗ Error: GROQ_API_KEY not set in .env file")
        print("Please create .env file from .env.example and add your Groq API key")
        return False
    
    try:
        print("1. Initializing chatbot...")
        chatbot = NISRAIChatbot()
        print("✓ Chatbot initialized successfully\n")
        
        # Test cases
        test_cases = [
            {
                "name": "Valid Rwanda nutrition question",
                "query": "What is the stunting rate among children in Rwanda?",
                "expected_relevant": True,
                "expected_context": True
            },
            {
                "name": "Valid survey metadata question",
                "query": "What surveys has NISR conducted about nutrition?",
                "expected_relevant": True,
                "expected_context": True
            },
            {
                "name": "Rwanda question with no data",
                "query": "What is the GDP of Rwanda in 2025?",
                "expected_relevant": True,
                "expected_context": False
            },
            {
                "name": "Out of scope - other country",
                "query": "What is the stunting rate in Kenya?",
                "expected_relevant": False,
                "expected_context": False
            },
            {
                "name": "Out of scope - general topic",
                "query": "What is the weather like today?",
                "expected_relevant": False,
                "expected_context": False
            },
            {
                "name": "Specific indicator query",
                "query": "What is the prevalence of anemia in Rwandan women?",
                "expected_relevant": True,
                "expected_context": True
            }
        ]
        
        passed = 0
        failed = 0
        
        for i, test in enumerate(test_cases, 1):
            print(f"\n{i}. Testing: {test['name']}")
            print(f"   Query: \"{test['query']}\"")
            
            result = chatbot.chat(test['query'])
            
            # Validate results
            checks = []
            
            if result['is_relevant'] == test['expected_relevant']:
                checks.append("✓ Relevance check")
            else:
                checks.append(f"✗ Relevance check (expected {test['expected_relevant']}, got {result['is_relevant']})")
            
            if result['context_used'] == test['expected_context']:
                checks.append("✓ Context usage")
            else:
                checks.append(f"✗ Context usage (expected {test['expected_context']}, got {result['context_used']})")
            
            # Print results
            for check in checks:
                print(f"   {check}")
            
            print(f"   Answer preview: {result['answer'][:150]}...")
            
            if all("✓" in check for check in checks):
                passed += 1
            else:
                failed += 1
        
        # Summary
        print("\n" + "="*60)
        print(f"Test Results: {passed} passed, {failed} failed out of {len(test_cases)} tests")
        print("="*60)
        
        if failed == 0:
            print("\n✓ All tests passed! Chatbot is working correctly.")
            return True
        else:
            print(f"\n✗ {failed} test(s) failed. Please review the output above.")
            return False
            
    except Exception as e:
        print(f"\n✗ Error during testing: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    success = test_chatbot()
    sys.exit(0 if success else 1)
