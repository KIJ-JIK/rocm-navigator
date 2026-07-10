import networkx as nx
from typing import Dict, Any, List

class ArchitectureAnalyzer:
    """
    Analyzes scanned file tokens to calculate migration difficulty,
    repository health, and map calling topologies to detect race conditions.
    """
    
    @staticmethod
    def analyze_repository_tokens(file_results: List[Dict[str, Any]]) -> Dict[str, Any]:
        graph = nx.DiGraph()
        
        total_kernels = 0
        total_launches = 0
        total_memory_calls = 0
        total_warp_votes = 0
        total_barriers = 0
        total_lines = 0
        
        health_score = 100
        difficulty_score = 10
        
        deadlocks_detected = False
        warnings = []
        
        # Iterate over files to construct call relations and score rules
        for file in file_results:
            filepath = file["file"]
            total_lines += file["lines_count"]
            
            # Count statistics
            total_kernels += len(file["kernels"])
            total_launches += len(file["launches"])
            total_memory_calls += len(file["memory_calls"])
            total_warp_votes += len(file["warp_votes"])
            total_barriers += len(file["barriers"])
            
            # Map calls to the graph
            for launch in file["launches"]:
                kname = launch["kernel_name"]
                graph.add_node(kname, file=filepath, line=launch.get("line", 0))
            
            # Deduct health for dangerous practices (e.g. legacy warp shuffles, sync patterns)
            if len(file["warp_votes"]) > 0:
                health_score -= (len(file["warp_votes"]) * 8)
                warnings.append(f"File {filepath} uses NVIDIA 32-thread warp vote sync commands. Requires wavefront adjustment.")
                
            if len(file["barriers"]) == 0 and len(file["launches"]) > 1:
                # Launches without explicit synchronization or stream mapping could race
                deadlocks_detected = True
                health_score -= 15
                warnings.append(f"Multiple kernel launches in {filepath} without explicit synchronization. Possible stream concurrency hazard.")
                
            # Update difficulty based on architectural components
            difficulty_score += len(file["kernels"]) * 10
            difficulty_score += len(file["warp_votes"]) * 5
            difficulty_score += len(file["memory_calls"]) * 2
            
        # Bound scores
        health_score = max(10, min(100, health_score))
        difficulty_score = max(10, min(100, difficulty_score))
        
        # Build dependency adjacency matrix representation for JSON serialization
        adjacency_map = {}
        for node in graph.nodes():
            adjacency_map[node] = list(graph.successors(node))
            
        warp_votes_per_file = {}
        for file in file_results:
            warp_votes_per_file[file["file"]] = file.get("warp_votes", [])

        return {
            "health_score": health_score,
            "difficulty_score": difficulty_score,
            "deadlocks_detected": deadlocks_detected,
            "warnings": warnings,
            "warp_votes": warp_votes_per_file,
            "summary_stats": {
                "total_lines": total_lines,
                "total_kernels": total_kernels,
                "total_launches": total_launches,
                "total_memory_calls": total_memory_calls,
                "total_warp_votes": total_warp_votes,
                "total_barriers": total_barriers
            },
            "call_topology": adjacency_map
        }
