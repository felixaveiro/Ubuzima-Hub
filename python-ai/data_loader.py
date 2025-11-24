"""
Data Loader for Ubuzima Hub AI System
Loads and prepares NISR datasets for RAG system
"""

import pandas as pd
import os
from pathlib import Path
from typing import List, Dict, Any
import json


class NISRDataLoader:
    """Loads and processes NISR datasets from CSV files"""
    
    def __init__(self, data_folder: str = "../data"):
        self.data_folder = Path(data_folder)
        self.nutrition_data = None
        self.survey_metadata = None
        self.documents = []
        
    def load_datasets(self) -> None:
        """Load all NISR datasets from CSV files"""
        print("Loading NISR datasets...")
        
        # Load nutrition indicators
        nutrition_path = self.data_folder / "nutrition_indicators_rwa.csv"
        if nutrition_path.exists():
            self.nutrition_data = pd.read_csv(nutrition_path)
            print(f"✓ Loaded nutrition indicators: {len(self.nutrition_data)} rows")
        else:
            print(f"✗ Warning: {nutrition_path} not found")
            
        # Load survey metadata
        survey_path = self.data_folder / "search-10-09-25-050154.csv"
        if survey_path.exists():
            self.survey_metadata = pd.read_csv(survey_path)
            print(f"✓ Loaded survey metadata: {len(self.survey_metadata)} rows")
        else:
            print(f"✗ Warning: {survey_path} not found")
            
    def prepare_documents(self) -> List[Dict[str, Any]]:
        """Convert datasets into documents for vector indexing"""
        print("\nPreparing documents for RAG system...")
        documents = []
        
        # Process nutrition indicators
        if self.nutrition_data is not None:
            for idx, row in self.nutrition_data.iterrows():
                # Create rich text document from each nutrition indicator
                doc_text = self._format_nutrition_indicator(row)
                
                documents.append({
                    "id": f"nutrition_{idx}",
                    "text": doc_text,
                    "metadata": {
                        "source": "NISR Nutrition Indicators",
                        "indicator": row.get("GHO (DISPLAY)", ""),
                        "year": row.get("YEAR (DISPLAY)", ""),
                        "country": "Rwanda",
                        "type": "nutrition_data"
                    }
                })
                
        # Process survey metadata
        if self.survey_metadata is not None:
            for idx, row in self.survey_metadata.iterrows():
                doc_text = self._format_survey_metadata(row)
                
                documents.append({
                    "id": f"survey_{idx}",
                    "text": doc_text,
                    "metadata": {
                        "source": "NISR Survey Catalog",
                        "survey_title": row.get("titl", ""),
                        "year_start": row.get("data_coll_start", ""),
                        "year_end": row.get("data_coll_end", ""),
                        "country": "Rwanda",
                        "type": "survey_metadata"
                    }
                })
                
        print(f"✓ Prepared {len(documents)} documents for indexing")
        self.documents = documents
        return documents
    
    def _format_nutrition_indicator(self, row: pd.Series) -> str:
        """Format nutrition indicator row as readable text"""
        indicator_name = row.get("GHO (DISPLAY)", "Unknown Indicator")
        year = row.get("YEAR (DISPLAY)", "Unknown Year")
        value = row.get("Value", "N/A")
        dimension_type = row.get("DIMENSION (TYPE)", "")
        dimension_name = row.get("DIMENSION (NAME)", "")
        
        text = f"Rwanda Nutrition Data ({year}): {indicator_name}"
        
        if dimension_type and dimension_name:
            text += f" for {dimension_name}"
            
        text += f". Value: {value}"
        
        # Add low/high range if available
        low = row.get("Low", "")
        high = row.get("High", "")
        if pd.notna(low) and pd.notna(high):
            text += f" (Range: {low}-{high})"
            
        return text
    
    def _format_survey_metadata(self, row: pd.Series) -> str:
        """Format survey metadata as readable text"""
        title = row.get("titl", "Unknown Survey")
        authority = row.get("authenty", "NISR")
        year_start = row.get("data_coll_start", "")
        year_end = row.get("data_coll_end", "")
        
        text = f"Rwanda Survey: {title}"
        text += f". Conducted by {authority}"
        
        if year_start and year_end:
            if year_start == year_end:
                text += f" in {year_start}"
            else:
                text += f" from {year_start} to {year_end}"
                
        return text
    
    def get_summary_statistics(self) -> Dict[str, Any]:
        """Get summary statistics about loaded datasets"""
        stats = {
            "nutrition_indicators": {
                "total_rows": len(self.nutrition_data) if self.nutrition_data is not None else 0,
                "years_covered": [],
                "indicators": []
            },
            "surveys": {
                "total_surveys": len(self.survey_metadata) if self.survey_metadata is not None else 0,
                "survey_types": []
            },
            "total_documents": len(self.documents)
        }
        
        if self.nutrition_data is not None:
            stats["nutrition_indicators"]["years_covered"] = sorted(
                self.nutrition_data["YEAR (DISPLAY)"].dropna().unique().tolist()
            )
            stats["nutrition_indicators"]["indicators"] = self.nutrition_data["GHO (DISPLAY)"].dropna().unique().tolist()[:10]
            
        if self.survey_metadata is not None:
            stats["surveys"]["survey_types"] = self.survey_metadata["titl"].dropna().unique().tolist()[:10]
            
        return stats


if __name__ == "__main__":
    # Test the data loader
    loader = NISRDataLoader()
    loader.load_datasets()
    documents = loader.prepare_documents()
    
    # Print summary
    stats = loader.get_summary_statistics()
    print("\n=== Dataset Summary ===")
    print(json.dumps(stats, indent=2))
    
    # Print sample documents
    print("\n=== Sample Documents ===")
    for doc in documents[:3]:
        print(f"\nID: {doc['id']}")
        print(f"Text: {doc['text'][:200]}...")
        print(f"Metadata: {doc['metadata']}")
